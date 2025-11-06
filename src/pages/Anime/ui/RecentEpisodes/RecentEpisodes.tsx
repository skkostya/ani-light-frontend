import { Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import type { UserEpisode } from '@/api/types/user.types';
import { userApi } from '@/api/user.api';
import { ROUTES } from '@/shared/constants';
import { getClientToken } from '@/shared/services/user-hash';
import { LocalizedLink, MainLoader } from '@/shared/ui';

import { animePageStyles } from '../../Anime.styles';
import { recentEpisodesStyles } from './RecentEpisodes.styles';

const RecentEpisodes = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const episodeNumber = searchParams.get('episode');

  const [episodes, setEpisodes] = useState<UserEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const token = getClientToken();
      if (!token) return;
      setIsLoading(true);
      try {
        const episodes = await userApi.getRecentEpisodes();
        setEpisodes(
          episodes.filter(
            (item) => item.episode.number !== Number(episodeNumber)
          )
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchEpisodes();
  }, [episodeNumber]);

  if (isLoading) return <MainLoader fullWidth />;
  if (episodes.length === 0) return null;

  return (
    <Box sx={animePageStyles.recentContainer}>
      <Typography variant="h6" sx={animePageStyles.recentTitle}>
        {t('anime_recent_episodes')}
      </Typography>
      <Box sx={recentEpisodesStyles.container}>
        <Box sx={recentEpisodesStyles.chipContainer}>
          {episodes.map((episode) => (
            <Tooltip
              key={episode.id}
              title={episode.episode.animeRelease.title_ru}
            >
              <Box sx={recentEpisodesStyles.chip}>
                <LocalizedLink
                  to={ROUTES.anime(episode.episode.animeRelease.alias, {
                    episodeNumber: String(episode.episode.number),
                    seasonNumber:
                      episode.episode.animeRelease.sort_order > 0
                        ? String(episode.episode.animeRelease.sort_order)
                        : undefined
                  })}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    width: '100%'
                  }}
                >
                  <Box sx={recentEpisodesStyles.chipContent}>
                    <Typography
                      variant="caption"
                      sx={recentEpisodesStyles.episodeTitle}
                    >
                      {episode.episode.animeRelease.title_ru}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={recentEpisodesStyles.episodeNumber}
                    >
                      {t('anime_episode_number', {
                        number: episode.episode.number
                      })}
                    </Typography>
                  </Box>
                </LocalizedLink>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default RecentEpisodes;
