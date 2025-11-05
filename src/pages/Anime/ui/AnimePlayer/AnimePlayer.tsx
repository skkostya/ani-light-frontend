import './anime-player.scss';

import { ErrorOutline, Refresh } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import ArtPlayer from 'artplayer';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/store/store';

import { animePlayerStyles } from './AnimePlayer.styles';
import useInitPlayer from './hooks/useInitPlayer';
import useSkipNextActions from './hooks/useSkipNextActions';

interface AnimePlayerProps {
  animePageRef: React.RefObject<HTMLDivElement | null>;
}

const AnimePlayer = ({ animePageRef }: AnimePlayerProps) => {
  const { t } = useTranslation();
  const { episode } = useAppSelector((state) => state.episode);

  const playerRef = useRef<HTMLDivElement>(null);
  const artPlayerRef = useRef<ArtPlayer | null>(null);

  const {
    updateButtonsVisibility,
    handleSkipNextPosition,
    addButtonsToLayers
  } = useSkipNextActions({
    playerRef,
    artPlayerRef,
    animePageRef
  });

  const { hasError, errorMessage, showPlaceholder, handleRetry } =
    useInitPlayer({
      playerRef,
      artPlayerRef,
      animePageRef,
      updateButtonsVisibility,
      handleSkipNextPosition,
      addButtonsToLayers
    });

  // Если нет URL видео, показываем placeholder
  if (showPlaceholder) {
    return (
      <Box sx={animePlayerStyles.container}>
        <Box sx={animePlayerStyles.playerPlaceholder}>
          <Box sx={animePlayerStyles.placeholderContent}>
            <Typography variant="h4" sx={animePlayerStyles.placeholderTitle}>
              {t('anime_player_placeholder_title')}
            </Typography>
          </Box>

          {/* Декоративные элементы */}
          <Box sx={animePlayerStyles.decorativeElements}>
            <Box sx={animePlayerStyles.glowCircle1} />
            <Box sx={animePlayerStyles.glowCircle2} />
            <Box sx={animePlayerStyles.glowCircle3} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={animePlayerStyles.container}>
      {/* Контейнер для плеера */}
      <Box sx={animePlayerStyles.playerWrapper}>
        <div
          ref={playerRef}
          style={{ width: '100%', height: '100%' }}
          data-opening-start={episode?.opening.start}
          data-opening-stop={episode?.opening.stop}
          data-ending-start={episode?.ending.start}
          data-ending-stop={episode?.ending.stop}
          data-total-duration={episode?.duration}
        />
      </Box>

      {/* Overlay ошибки */}
      {hasError && (
        <Box sx={animePlayerStyles.errorOverlay}>
          <Box sx={animePlayerStyles.errorContent}>
            <ErrorOutline sx={animePlayerStyles.errorIcon} />
            <Typography variant="h5" sx={animePlayerStyles.errorTitle}>
              {t('anime_player_error')}
            </Typography>
            <Typography variant="body1" sx={animePlayerStyles.errorMessage}>
              {errorMessage}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRetry}
              startIcon={<Refresh />}
              sx={animePlayerStyles.retryButton}
            >
              {t('anime_player_retry')}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AnimePlayer;
