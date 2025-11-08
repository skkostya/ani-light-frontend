import { PlaylistPlay as WatchListIcon } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { INextUserEpisode } from '@/api/types/user.types';
import { userApi } from '@/api/user.api';
import { AnimeCard } from '@/shared/entities/anime-card';
import type { Anime } from '@/shared/entities/anime-card/anime-card.types';
import { toast } from '@/shared/entities/toast';
import { getClientToken } from '@/shared/services/user-hash';
import { Grid, MainLoader } from '@/shared/ui';

import { NextEpisodeCard } from './ui';

const WatchList: React.FC = () => {
  const { t } = useTranslation();

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [nextEpisodes, setNextEpisodes] = useState<INextUserEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (animeId: string) => {
    const originalState = !!animeList.find((a) => a.id === animeId)?.isFavorite;

    // Оптимистичное обновление UI
    setAnimeList((prevList) =>
      prevList.map((anime) =>
        anime.id === animeId ? { ...anime, isFavorite: !originalState } : anime
      )
    );

    try {
      await userApi.toggleFavoriteAnime(animeId);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message, 'Ошибка');
      // В случае ошибки возвращаем исходное состояние
      setAnimeList((prevList) =>
        prevList.map((anime) =>
          anime.id === animeId ? { ...anime, isFavorite: originalState } : anime
        )
      );
    }
  };

  const handleToggleWantToWatch = async (animeId: string) => {
    const originalState = !!animeList.find((a) => a.id === animeId)
      ?.isWantToWatch;

    // Оптимистичное обновление UI
    setAnimeList((prevList) =>
      prevList.map((anime) =>
        anime.id === animeId
          ? { ...anime, isWantToWatch: !originalState }
          : anime
      )
    );

    try {
      await userApi.toggleWantToWatchAnime(animeId);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message, 'Ошибка');
      // В случае ошибки возвращаем исходное состояние
      setAnimeList((prevList) =>
        prevList.map((anime) =>
          anime.id === animeId
            ? { ...anime, isWantToWatch: originalState }
            : anime
        )
      );
    }
  };

  const handleDeleteEpisode = async (animeId: string) => {
    const episodeToDelete = nextEpisodes.find(
      (episode) => episode.anime_id === animeId
    );
    const animeToDelete = animeList.find((anime) => anime.id === animeId);

    try {
      await userApi.removeUserActiveAnime(animeId);
      toast.success(t('watchlist_episode_removed'), t('success_title'));
      setNextEpisodes((prevEpisodes) =>
        prevEpisodes.filter((episode) => episode.anime_id !== animeId)
      );
      setAnimeList((prevAnimeList) =>
        prevAnimeList.filter((anime) => anime.id === animeId)
      );
    } catch (err) {
      const error = err as Error;
      toast.error(error.message, t('error_title'));
      if (episodeToDelete)
        setNextEpisodes((prev) => [...prev, episodeToDelete]);
      if (animeToDelete) setAnimeList((prev) => [...prev, animeToDelete]);
    }
  };

  useEffect(() => {
    const accessToken = getClientToken();
    if (!accessToken) return;

    (async () => {
      setIsLoading(true);
      try {
        const nextEpisodesResponse = await userApi.getUserNextEpisodes();
        setNextEpisodes(
          nextEpisodesResponse.filter((item) => item.next_episode !== null)
        );

        const response = await userApi.getUserActiveAnimeList();
        setAnimeList(
          response.map((item) => {
            const release = item.lastWatchedEpisode.animeRelease;
            const genres =
              release?.animeGenres?.map((genre) => genre.genre.name) || [];
            return {
              id: item.id,
              alias: item.anime.alias,
              title: item.anime.name,
              originalTitle: item.anime.name_english,
              description: release?.description || '',
              imageUrl: item.anime.image || release?.poster_url || '',
              isFavorite: item.is_favorite,
              isWantToWatch: item.want_to_watch,
              genres: genres,
              year: item.anime.last_year,
              seasons: item.anime.total_releases,
              episodes: item.anime.total_episodes,
              onGoing: false,
              dominantColor: item.anime.accent_colors?.[0]?.dominant
            };
          })
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        {/* Заголовок */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 0 }}>
            {t('watchlist_title')}
          </Typography>
        </Box>

        {!isLoading && nextEpisodes.length > 0 ? (
          <>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ mb: 3, mt: 4 }}
            >
              {t('watchlist_next_episodes_title')}
            </Typography>
            <Grid maxColCount={3} minColSize={300} gap={16}>
              {nextEpisodes.map((episode) => (
                <NextEpisodeCard
                  key={`${episode.anime_id}-${episode.next_episode.id}`}
                  episode={episode}
                  onDelete={() => handleDeleteEpisode(episode.anime_id)}
                />
              ))}
            </Grid>
            <div style={{ height: 24 }} />
          </>
        ) : null}

        <Typography variant="body1" color="text.secondary" paragraph>
          {t('watchlist_description')}
        </Typography>

        {/* Сетка карточек аниме */}
        <div>
          {isLoading ? (
            <MainLoader fullWidth />
          ) : animeList.length > 0 ? (
            <Grid maxColCount={3} minColSize={260} gap={16}>
              {animeList.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleWantToWatch={handleToggleWantToWatch}
                  variant="compact"
                />
              ))}
            </Grid>
          ) : (
            /* Пустое состояние */
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center'
              }}
            >
              <WatchListIcon
                sx={{
                  fontSize: 64,
                  color: 'var(--color-text-disabled)',
                  mb: 2
                }}
              />
              <Typography variant="h5" component="h2" gutterBottom>
                {t('watchlist_empty_title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('watchlist_empty_description')}
              </Typography>
            </Box>
          )}
        </div>
      </Box>
    </Container>
  );
};

export default WatchList;
