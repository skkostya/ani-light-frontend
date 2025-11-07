import { PlaylistPlay, SkipNext, SkipPrevious } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';

import { ROUTES } from '@/shared/constants';
import { useAppNavigate } from '@/shared/hooks/useAppNavigate';

import useUserVideo from '../../hooks/useUserVideo';
import { animeControlsStyles } from './AnimeControls.styles';

interface IProps {
  onNextEpisode?: () => void;
  animePageRef: React.RefObject<HTMLDivElement | null>;
}

const AnimeControls = ({ onNextEpisode, animePageRef }: IProps) => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigate();
  const { alias } = useParams<{ alias: string }>();

  const [searchParams] = useSearchParams();
  const seasonNumber = searchParams.get('season');
  const episodeNumber = searchParams.get('episode');

  const { handleMarkEpisodeWatched } = useUserVideo({ animePageRef });

  const handlePrevious = () => {
    if (Number(episodeNumber) === 1) return;
    navigate(
      ROUTES.anime(alias, {
        episodeNumber: String(Number(episodeNumber) - 1),
        seasonNumber: seasonNumber ?? undefined
      })
    );
  };

  const handleNext = () => {
    if (!onNextEpisode) return;
    handleMarkEpisodeWatched();
    onNextEpisode();
  };

  const handleAllEpisodes = () => {
    navigate(ROUTES.animeEpisodes(alias));
  };

  return (
    <Box sx={animeControlsStyles.container}>
      <Stack
        direction={'row'}
        spacing={{ xs: 2, sm: 3 }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Предыдущая серия */}
        <Button
          variant="outlined"
          onClick={handlePrevious}
          sx={animeControlsStyles.controlButton}
          disabled={Number(episodeNumber) === 1}
        >
          <SkipPrevious />
          <Typography
            variant="body1"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {t('anime_controls_previous')}
          </Typography>
        </Button>

        {/* Все серии */}
        <Button
          variant="outlined"
          onClick={handleAllEpisodes}
          sx={animeControlsStyles.controlButton}
        >
          <PlaylistPlay />
          {t('anime_controls_all_episodes')}
        </Button>

        {/* Следующая серия */}
        <Button
          id="next-episode-button"
          variant="contained"
          onClick={handleNext}
          sx={animeControlsStyles.controlButton}
          disabled={!onNextEpisode}
        >
          <Typography
            variant="body1"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {t('anime_controls_next')}
          </Typography>
          <SkipNext />
        </Button>
      </Stack>
    </Box>
  );
};

export default AnimeControls;
