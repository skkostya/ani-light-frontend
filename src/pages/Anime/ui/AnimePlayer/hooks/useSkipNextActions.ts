import ArtPlayer from 'artplayer';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface UseSkipNextActionsProps {
  playerRef: React.RefObject<HTMLDivElement | null>;
  artPlayerRef: React.RefObject<ArtPlayer | null>;
  animePageRef: React.RefObject<HTMLDivElement | null>;
}

const useSkipNextActions = ({
  playerRef,
  artPlayerRef,
  animePageRef
}: UseSkipNextActionsProps) => {
  const { t } = useTranslation();

  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Функция для создания HTML кнопки пропуска опенинга
  const createSkipOpeningButton = () => {
    const button = document.createElement('button');
    skipButtonRef.current = button;
    button.className =
      'anime-player__timing-action anime-player__timing-action--skip';
    button.innerHTML = t('anime_player_skip_opening');
    button.style.cssText = `
      display: none;
      position: absolute;
      bottom: 64px;
      left: 10px;
      z-index: 1000;
      background: var(--gradient-magic);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: var(--border-radius-medium);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--shadow-glow);
      transition: all 0.3s ease-in-out;
      text-transform: none;
    `;

    button.addEventListener('click', () => {
      if (artPlayerRef.current) {
        artPlayerRef.current.video.currentTime = Number(
          playerRef.current?.dataset.openingStop
        );
      }
    });

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 8px 25px rgba(233, 30, 99, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'var(--shadow-glow)';
    });

    return button;
  };

  // Функция для создания HTML кнопки следующей серии
  const createNextEpisodeButton = () => {
    const button = document.createElement('button');
    nextButtonRef.current = button;
    button.className =
      'anime-player__timing-action anime-player__timing-action--next';
    button.innerHTML = t('anime_player_next_episode');
    button.style.cssText = `
      display: none;
      position: absolute;
      bottom: 64px;
      right: 10px;
      z-index: 1000;
      background: var(--gradient-magic);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: var(--border-radius-medium);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--shadow-glow);
      transition: all 0.3s ease-in-out;
      text-transform: none;
    `;

    button.addEventListener('click', (event: MouseEvent) => {
      const nextEpisodeButton = document.getElementById('next-episode-button');
      if (nextEpisodeButton) {
        (event.target as HTMLElement).style.display = 'none';
        nextEpisodeButton.click();
      }
    });

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 8px 25px rgba(233, 30, 99, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'var(--shadow-glow)';
    });

    return button;
  };

  // Функция для обновления видимости кнопок
  const updateButtonsVisibility = (currentTime: number) => {
    if (!artPlayerRef.current) return;

    try {
      const autoSkipOpening =
        animePageRef.current?.dataset.autoSkipOpening === 'true';
      const autoNextEpisode =
        animePageRef.current?.dataset.autoNextEpisode === 'true';

      if (!autoSkipOpening) {
        const skipButton = skipButtonRef.current;

        const openingStart = playerRef.current?.dataset.openingStart
          ? Number(playerRef.current?.dataset.openingStart)
          : null;
        const openingStop = playerRef.current?.dataset.openingStop
          ? Number(playerRef.current?.dataset.openingStop)
          : null;

        if (
          typeof openingStart === 'number' &&
          typeof openingStop === 'number' &&
          skipButton &&
          skipButton instanceof HTMLElement
        ) {
          const shouldShowSkip =
            currentTime >= openingStart && currentTime < openingStop;
          const display = shouldShowSkip ? 'block' : 'none';
          if (skipButton.style.display !== display) {
            skipButton.style.display = display;
          }
        }
      }

      if (!autoNextEpisode) {
        const nextButton = nextButtonRef.current;

        const endingStart = playerRef.current?.dataset.endingStart
          ? Number(playerRef.current?.dataset.endingStart)
          : 0;
        const totalDuration =
          Number(playerRef.current?.dataset.totalDuration || 10) - 10;

        if (
          (typeof endingStart === 'number' || totalDuration) &&
          nextButton &&
          nextButton instanceof HTMLElement
        ) {
          const animePage = animePageRef.current;
          const nextEpisodeNumber = animePage?.dataset.nextEpisodeNumber;
          const shouldShowNext =
            currentTime >= (endingStart || totalDuration) &&
            !!nextEpisodeNumber;
          const display = shouldShowNext ? 'block' : 'none';
          if (nextButton.style.display !== display) {
            nextButton.style.display = display;
          }
        }
      }
    } catch (error) {
      console.warn('Error updating button visibility:', error);
    }
  };

  const handleSkipNextPosition = (isFullscreen: boolean) => {
    if (skipButtonRef.current) {
      skipButtonRef.current.style.bottom = isFullscreen ? '82px' : '64px';
    }
    if (nextButtonRef.current) {
      nextButtonRef.current.style.bottom = isFullscreen ? '82px' : '64px';
    }
  };

  // Функция для добавления кнопок в layers
  const addButtonsToLayers = () => {
    if (!artPlayerRef.current) return;

    // Добавляем кнопку пропуска опенинга
    artPlayerRef.current.layers.update({
      name: 'skip-opening',
      html: createSkipOpeningButton()
    });

    // Добавляем кнопку следующей серии
    artPlayerRef.current.layers.update({
      name: 'next-episode',
      html: createNextEpisodeButton()
    });
  };

  return {
    updateButtonsVisibility,
    handleSkipNextPosition,
    addButtonsToLayers
  };
};

export default useSkipNextActions;
