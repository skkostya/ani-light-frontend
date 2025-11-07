import ArtPlayer from 'artplayer';

import type { EpisodeDetails } from '@/api/types/episode.types';
import { storageApi } from '@/local-storage-api/storage.api';

export const mainEpisodeInfo = (episode: EpisodeDetails) => {
  const qualityOptions: { name: string; url: string; default: boolean }[] = [];

  const currentQuality = storageApi.getPlayerSettings().quality;

  if (episode?.video_url_1080) {
    qualityOptions.push({
      name: '1080p',
      url: episode.video_url_1080,
      default: currentQuality !== undefined ? currentQuality === '1080p' : true
    });
  }

  if (episode?.video_url_720) {
    qualityOptions.push({
      name: '720p',
      url: episode.video_url_720,
      default:
        currentQuality !== undefined
          ? currentQuality === '720p'
          : !episode?.video_url_1080
    });
  }

  if (episode?.video_url_480) {
    qualityOptions.push({
      name: '480p',
      url: episode.video_url_480,
      default:
        currentQuality !== undefined
          ? currentQuality === '480p'
          : !episode?.video_url_1080 && !episode?.video_url_720
    });
  }

  const hasDefaultQuality = qualityOptions.some((q) => q.default);
  if (!hasDefaultQuality && qualityOptions.length > 0) {
    qualityOptions[0].default = true;
    storageApi.updatePlayerSettings({ quality: qualityOptions[0].name });
  }

  // Выбираем URL на основе сохраненного качества или дефолтного
  let selectedVideoUrl = episode?.video_url || undefined;
  const defaultQualityOption = qualityOptions.find((q) => q.default);
  if (defaultQualityOption) {
    selectedVideoUrl = defaultQualityOption.url;
  }

  return {
    episodeId: episode?.id || '',
    videoUrl: selectedVideoUrl,
    poster: episode?.preview_image
      ? process.env.PUBLIC_ANILIBRIA_URL + episode.preview_image
      : undefined,
    title: episode?.animeRelease.title_ru,
    subtitle: episode?.animeRelease.title_en,
    quality: qualityOptions
  };
};

interface TimeupdateHandlerProps {
  episodeId: string;
  hasSkippedOpeningRef: React.RefObject<boolean>;
  artPlayerRef: React.RefObject<ArtPlayer | null>;
  animePageRef: React.RefObject<HTMLDivElement | null>;
  playerRef: React.RefObject<HTMLDivElement | null>;
  lastUpdateTimeRef: React.RefObject<number>;
  updateButtonsVisibility: (currentTime: number) => void;
  handleStartWatching: (episodeId: string) => void;
  handleMarkEpisodeWatched: (episodeId: string) => void;
}

export const timeupdateHandlerHelper = ({
  episodeId,
  hasSkippedOpeningRef,
  artPlayerRef,
  animePageRef,
  playerRef,
  lastUpdateTimeRef,
  updateButtonsVisibility,
  handleStartWatching,
  handleMarkEpisodeWatched
}: TimeupdateHandlerProps) => {
  // Предотвращаем излишние вызовы
  const now = Date.now();
  if (now - lastUpdateTimeRef.current < 2500) return;
  lastUpdateTimeRef.current = now;

  const newTime = artPlayerRef.current?.currentTime || 0;
  // Обновляем видимость кнопок при изменении времени
  updateButtonsVisibility(newTime);

  const autoSkipOpening =
    animePageRef.current?.dataset.autoSkipOpening === 'true';
  // Автоматический пропуск опенинга
  if (autoSkipOpening && !hasSkippedOpeningRef.current) {
    const openingStart = playerRef.current?.dataset.openingStart
      ? Number(playerRef.current?.dataset.openingStart)
      : null;
    const openingStop = playerRef.current?.dataset.openingStop
      ? Number(playerRef.current?.dataset.openingStop)
      : null;

    if (
      typeof openingStart === 'number' &&
      typeof openingStop === 'number' &&
      newTime >= openingStart &&
      newTime < openingStop &&
      artPlayerRef.current
    ) {
      artPlayerRef.current.currentTime = openingStop;
      hasSkippedOpeningRef.current = true;
    }
  }

  // Сохраняем время просмотра
  const seasonExternalId = animePageRef.current?.dataset.seasonExternalId
    ? Number(animePageRef.current?.dataset.seasonExternalId)
    : 0;
  const currentEpisodeNumber = animePageRef.current?.dataset
    .currentEpisodeNumber
    ? Number(animePageRef.current?.dataset.currentEpisodeNumber)
    : 0;
  storageApi.updateWatchingTime({
    seasonExternalId: seasonExternalId,
    episodeNumber: currentEpisodeNumber,
    watchingTime: Math.floor(newTime)
  });

  if (newTime >= 30) handleStartWatching(episodeId);

  const endingStart = playerRef.current?.dataset.endingStart
    ? Number(playerRef.current?.dataset.endingStart)
    : null;
  const totalDuration = Number(playerRef.current?.dataset.totalDuration);
  if (
    (typeof endingStart === 'number' && newTime >= endingStart) ||
    (totalDuration && newTime >= totalDuration - 10)
  ) {
    // Автоматическое переключение на следующую серию
    const autoNextEpisode =
      animePageRef.current?.dataset.autoNextEpisode === 'true';
    if (autoNextEpisode) {
      const nextEpisodeButton = document.getElementById('next-episode-button');
      if (nextEpisodeButton) nextEpisodeButton.click();
    }
    handleMarkEpisodeWatched(episodeId);
  }
};
