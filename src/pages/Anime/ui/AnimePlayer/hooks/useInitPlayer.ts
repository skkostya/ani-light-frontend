import ArtPlayer from 'artplayer';
import Hls from 'hls.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { storageApi } from '@/local-storage-api/storage.api';
import { useAppSelector } from '@/store/store';

import useUserVideo from '../../../hooks/useUserVideo';
import { mainEpisodeInfo, timeupdateHandlerHelper } from '../helpers';

interface UseInitPlayerProps {
  playerRef: React.RefObject<HTMLDivElement | null>;
  artPlayerRef: React.RefObject<ArtPlayer | null>;
  animePageRef: React.RefObject<HTMLDivElement | null>;
  updateButtonsVisibility: (currentTime: number) => void;
  handleSkipNextPosition: (isFullscreen: boolean) => void;
  addButtonsToLayers: () => void;
}

const useInitPlayer = ({
  playerRef,
  artPlayerRef,
  animePageRef,
  updateButtonsVisibility,
  handleSkipNextPosition,
  addButtonsToLayers
}: UseInitPlayerProps) => {
  const { t } = useTranslation();
  const { episode } = useAppSelector((state) => state.episode);

  const { handleStartWatching, handleMarkEpisodeWatched } = useUserVideo();
  const hlsRef = useRef<Hls | null>(null);
  const hasSkippedOpeningRef = useRef(false);
  const lastUpdateTimeRef = useRef<number>(0);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const eventHandlersRef = useRef<{
    ready?: () => void;
    error?: (error: unknown) => void;
    play?: () => void;
    timeupdate?: () => void;
    fullscreen?: (isFullscreen: unknown) => void;
  }>({});

  const { episodeId, videoUrl, poster, title, quality } = useMemo(() => {
    if (!episode)
      return {
        episodeId: '',
        videoUrl: '',
        poster: '',
        title: '',
        quality: []
      };
    return mainEpisodeInfo(episode);
  }, [episode]);

  // Проверяем, является ли URL HLS потоком
  const isHlsUrl = (url: string) => {
    return (
      url.includes('.m3u8') || url.includes('application/vnd.apple.mpegurl')
    );
  };

  // Функция для очистки всех обработчиков событий
  const cleanupEventHandlers = () => {
    if (!artPlayerRef.current) return;

    const handlers = eventHandlersRef.current;

    if (handlers.ready) {
      artPlayerRef.current.off('ready', handlers.ready);
      handlers.ready = undefined;
    }

    if (handlers.error) {
      artPlayerRef.current.off('error', handlers.error);
      handlers.error = undefined;
    }

    if (handlers.play) {
      artPlayerRef.current.off('video:play', handlers.play);
      handlers.play = undefined;
    }

    if (handlers.timeupdate) {
      artPlayerRef.current.off('video:timeupdate', handlers.timeupdate);
      handlers.timeupdate = undefined;
    }

    if (handlers.fullscreen) {
      artPlayerRef.current.off('fullscreen', handlers.fullscreen);
      handlers.fullscreen = undefined;
    }
  };

  // Функция для добавления кастомных настроек
  const addCustomSettings = () => {
    if (!artPlayerRef.current) return;

    if (artPlayerRef.current.setting.find('quality')) {
      artPlayerRef.current.setting.remove('quality');
    }

    // Добавляем настройки качества (всегда доступны)
    if (quality.length > 0) {
      artPlayerRef.current.setting.add({
        name: 'quality',
        html: t('anime_player_quality'),
        width: 200,
        tooltip: t('anime_player_quality_tooltip'),
        selector: quality.map((q) => ({
          html: q.name,
          value: q.url,
          default: q.default
        })),
        onSelect: function (item) {
          if (artPlayerRef.current && 'value' in item) {
            const selectedUrl = item.value as string;
            artPlayerRef.current.switchUrl(selectedUrl);

            // Находим название качества по URL и сохраняем его
            const selectedQuality = quality.find((q) => q.url === selectedUrl);
            if (selectedQuality) {
              storageApi.updatePlayerSettings({
                quality: selectedQuality.name
              });
            }
          }
          return item.html;
        }
      });
    }
  };

  // Создаем конфигурацию для ArtPlayer
  const createPlayerConfig = () => {
    const config = {
      container: playerRef.current!,
      url: videoUrl!,
      poster: poster || '',
      title: title,
      volume: storageApi.getPlayerSettings().volume ?? 1,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: true,
      screenshot: false,
      loop: false,
      playbackRate: true,
      fullscreen: true,
      fullscreenWeb: false, // Отключаем веб-полноэкранный режим
      mutex: true,
      backdrop: true,
      playsInline: true,
      airplay: true,
      autoOrientation: true, // Включаем автоматический поворот экрана
      theme: '#e91e63',
      lang: 'ru',
      setting: true,
      // Добавляем поддержку HLS
      customType: {
        m3u8: (video: HTMLVideoElement, url: string) => {
          // Переиспользуем существующий экземпляр HLS если он есть
          if (hlsRef.current) {
            try {
              // Останавливаем загрузку текущего потока
              hlsRef.current.stopLoad();
              // Отсоединяем от старого видео элемента
              hlsRef.current.detachMedia();
              // Прикрепляем к новому видео элементу
              hlsRef.current.attachMedia(video);
              // Загружаем новый источник
              hlsRef.current.loadSource(url);
              return hlsRef.current;
            } catch (e) {
              console.warn('HLS reuse failed, creating new instance:', e);
              // Если переиспользование не удалось, уничтожаем и создаем новый
              try {
                hlsRef.current.destroy();
              } catch (destroyError) {
                console.warn('HLS destroy failed:', destroyError);
              }
              hlsRef.current = null;
            }
          }

          // Создаем новый экземпляр только если его нет
          if (Hls.isSupported() && !hlsRef.current) {
            hlsRef.current = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });

            hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error(
                      'Fatal network error encountered, try to recover'
                    );
                    hlsRef.current?.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error(
                      'Fatal media error encountered, try to recover'
                    );
                    hlsRef.current?.recoverMediaError();
                    break;
                  default:
                    console.error('Fatal error, cannot recover');
                    hlsRef.current?.destroy();
                    hlsRef.current = null;
                    break;
                }
              }
            });

            hlsRef.current.loadSource(url);
            hlsRef.current.attachMedia(video);

            return hlsRef.current;
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Нативная поддержка HLS (Safari)
            video.src = url;
            return null;
          } else {
            throw new Error('HLS is not supported in this browser');
          }
        }
      }
    };

    return config;
  };

  // Инициализация плеера
  useEffect(() => {
    if (!playerRef.current || !videoUrl || artPlayerRef.current) return;

    const initPlayer = async () => {
      try {
        setHasError(false);

        // Проверяем валидность URL
        if (!videoUrl || videoUrl.trim() === '') {
          throw new Error('URL видео не указан');
        }

        // Проверяем, что URL начинается с http/https
        if (
          !videoUrl.startsWith('http://') &&
          !videoUrl.startsWith('https://')
        ) {
          throw new Error('Некорректный URL видео');
        }

        // Проверяем поддержку HLS
        if (isHlsUrl(videoUrl)) {
          const video = document.createElement('video');
          if (
            !Hls.isSupported() &&
            !video.canPlayType('application/vnd.apple.mpegurl')
          ) {
            throw new Error('HLS формат не поддерживается в этом браузере');
          }
        }

        // Создаем новый экземпляр плеера
        if (!playerRef.current) return;
        const config = createPlayerConfig();

        try {
          const player = new ArtPlayer(config);
          artPlayerRef.current = player;
        } catch (error) {
          console.error('Failed to create ArtPlayer:', error);
          setHasError(true);
          setErrorMessage('Ошибка инициализации плеера');
          return;
        }

        // Очищаем старые обработчики перед добавлением новых
        cleanupEventHandlers();

        // Обработчики событий - создаем как именованные функции и сохраняем в ref
        const readyHandler = () => {
          // Добавляем кнопки в layers после готовности плеера
          addButtonsToLayers();

          // Добавляем кастомные настройки
          addCustomSettings();
        };
        eventHandlersRef.current.ready = readyHandler;
        artPlayerRef.current.on('ready', readyHandler);

        const errorHandler = (error: unknown) => {
          console.error('Player error:', error);
          setHasError(true);

          // Определяем тип ошибки и извлекаем сообщение
          let errorMessage = t('anime_player_error');

          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (error && typeof error === 'object' && 'type' in error) {
            // Это DOM Event
            const event = error as Event;
            if (event.target && event.target instanceof HTMLVideoElement) {
              const video = event.target;
              const mediaError = video.error;
              if (mediaError) {
                switch (mediaError.code) {
                  case MediaError.MEDIA_ERR_ABORTED:
                    errorMessage = 'Видео было прервано';
                    break;
                  case MediaError.MEDIA_ERR_NETWORK:
                    errorMessage =
                      'Ошибка сети при загрузке видео. Возможно, проблема с CORS или сервер недоступен';
                    break;
                  case MediaError.MEDIA_ERR_DECODE:
                    errorMessage = 'Ошибка декодирования видео';
                    break;
                  case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = 'Формат видео не поддерживается';
                    break;
                  default:
                    errorMessage = `Ошибка видео: ${
                      mediaError.message || 'Неизвестная ошибка'
                    }`;
                }
              } else {
                errorMessage = 'Ошибка загрузки видео';
              }
            }
          }

          setErrorMessage(errorMessage);
        };
        eventHandlersRef.current.error = errorHandler;
        artPlayerRef.current.on('error', errorHandler);

        const playHandler = () => {
          const seasonExternalId = animePageRef.current?.dataset
            .seasonExternalId
            ? Number(animePageRef.current?.dataset.seasonExternalId)
            : 0;
          const currentEpisodeNumber = animePageRef.current?.dataset
            .currentEpisodeNumber
            ? Number(animePageRef.current?.dataset.currentEpisodeNumber)
            : 0;
          const watchingTime = storageApi.getWatchingTime(
            seasonExternalId,
            currentEpisodeNumber
          );
          if (
            watchingTime > 0 &&
            artPlayerRef.current &&
            artPlayerRef.current.currentTime === 0
          ) {
            artPlayerRef.current.currentTime = watchingTime;
          }
          // Сбрасываем флаг пропуска опенинга при начале воспроизведения
          hasSkippedOpeningRef.current = false;
        };
        eventHandlersRef.current.play = playHandler;
        artPlayerRef.current.on('video:play', playHandler);

        const timeupdateHandler = timeupdateHandlerHelper.bind(null, {
          episodeId,
          hasSkippedOpeningRef,
          artPlayerRef,
          animePageRef,
          playerRef,
          lastUpdateTimeRef,
          updateButtonsVisibility,
          handleStartWatching,
          handleMarkEpisodeWatched
        });
        eventHandlersRef.current.timeupdate = timeupdateHandler;
        artPlayerRef.current.on('video:timeupdate', timeupdateHandler);

        // Обработчик полноэкранного режима
        const fullscreenHandler = (isFullscreen: unknown) => {
          if (isFullscreen) {
            // Принудительно поворачиваем экран в ландшафт при полноэкранном режиме
            if (screen.orientation && 'lock' in screen.orientation) {
              (screen.orientation as ScreenOrientation)
                .lock('landscape')
                .catch((err: unknown) => {
                  console.warn('Could not lock orientation:', err);
                });
            }
          } else {
            // Разблокируем поворот экрана при выходе из полноэкранного режима
            if (screen.orientation && 'unlock' in screen.orientation) {
              (screen.orientation as ScreenOrientation).unlock();
            }
          }
          handleSkipNextPosition(Boolean(isFullscreen));
        };
        eventHandlersRef.current.fullscreen = fullscreenHandler;
        artPlayerRef.current.on('fullscreen', fullscreenHandler);
      } catch (error) {
        console.error('Failed to initialize player:', error);
        setHasError(true);
        setErrorMessage(t('anime_player_error'));
      }
    };

    initPlayer();

    // Очистка при размонтировании
    return () => {
      if (artPlayerRef.current) {
        // Очищаем HLS - уничтожаем и из video и из ref
        const video = artPlayerRef.current.video;
        if (video && 'hls' in video && video.hls) {
          try {
            (video.hls as Hls).destroy();
          } catch (e) {
            console.warn('HLS destroy from video failed:', e);
          }
        }

        // Также уничтожаем экземпляр из ref если он есть
        if (hlsRef.current) {
          try {
            hlsRef.current.destroy();
            hlsRef.current = null;
          } catch (e) {
            console.warn('HLS destroy from ref failed:', e);
          }
        }
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    if (artPlayerRef.current && videoUrl) {
      artPlayerRef.current.switchUrl(videoUrl);
      artPlayerRef.current.poster = poster || '';
      artPlayerRef.current.title = title || '';
      addCustomSettings();

      const readyHandler = () => {
        artPlayerRef.current?.play();
      };
      artPlayerRef.current.on('ready', readyHandler);
      return () => {
        artPlayerRef.current?.off('ready', readyHandler);
      };
    }
  }, [videoUrl]);

  useEffect(() => {
    let isFullscreen = false;
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'f' && playerRef.current) {
        if (!isFullscreen) {
          playerRef.current?.requestFullscreen();
          isFullscreen = true;
          handleSkipNextPosition(true);
        } else {
          document.exitFullscreen();
          isFullscreen = false;
          handleSkipNextPosition(false);
        }
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Обработка повторной попытки
  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    if (videoUrl) {
      // Переинициализируем плеер
      const player = artPlayerRef.current;
      if (player) {
        // Перезагружаем видео
        player.switchUrl(videoUrl);
      }
    }
  };

  return {
    hasError,
    errorMessage,
    handleRetry
  };
};

export default useInitPlayer;
