import { Favorite as FavoriteIcon } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { userApi } from '@/api/user.api';
import { ROUTES } from '@/shared/constants';
import { toast } from '@/shared/entities';
import { AnimeCard } from '@/shared/entities/anime-card';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { getClientToken } from '@/shared/services/user-hash';
import { Grid, LoadingIndicator, MainLoader, SEO } from '@/shared/ui';

import { useFavoritesPagination } from './hooks';

const Favorites: React.FC = () => {
  const { t } = useTranslation();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { animeList, pagination, loadMore, resetAndLoad, updateAnimeInList } =
    useFavoritesPagination();

  const handleToggleFavorite = useCallback(
    async (animeId: string) => {
      // Сначала находим исходное состояние
      const originalAnime = animeList.find((a) => a.id === animeId);
      if (!originalAnime) return;

      const wasFavorite = originalAnime.isFavorite;

      try {
        await userApi.toggleFavoriteAnime(animeId);
        // Показываем toast на основе исходного состояния
        if (wasFavorite) {
          toast.info('Аниме удалено из избранного', 'Информация');
        } else {
          toast.success('Аниме добавлено в избранное!', 'Успех');
        }
      } catch (err) {
        const error = err as Error;
        toast.error(error.message, 'Ошибка');
        // В случае ошибки возвращаем аниме в список
        updateAnimeInList(animeId, { isFavorite: wasFavorite });
      }
    },
    [animeList, updateAnimeInList]
  );

  const handleToggleWantToWatch = useCallback(
    async (animeId: string) => {
      const originalState = animeList.find(
        (a) => a.id === animeId
      )?.isWantToWatch;

      // Оптимистичное обновление UI
      updateAnimeInList(animeId, { isWantToWatch: !originalState });

      try {
        await userApi.toggleWantToWatchAnime(animeId);
        // Показываем успешное уведомление
        if (originalState) {
          toast.success('Аниме удалено из списка "Хочу посмотреть"', 'Успех');
        } else {
          toast.success('Аниме добавлено в список "Хочу посмотреть"', 'Успех');
        }
      } catch (err) {
        const error = err as Error;
        toast.error(error.message, 'Ошибка');
        // В случае ошибки возвращаем исходное состояние
        updateAnimeInList(animeId, { isWantToWatch: originalState });
      }
    },
    [animeList, updateAnimeInList]
  );

  // Настройка Intersection Observer для бесконечной прокрутки
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Загружаем больше контента при пересечении с индикатором загрузки
  useEffect(() => {
    if (
      isIntersecting &&
      pagination.hasMore &&
      !pagination.isLoading &&
      animeList.length > 0 // Загружаем только если уже есть данные
    ) {
      loadMore();
    }
  }, [
    isIntersecting,
    pagination.hasMore,
    pagination.isLoading,
    animeList.length,
    loadMore
  ]);

  // Загружаем начальные данные
  useEffect(() => {
    const accessToken = getClientToken();
    if (!accessToken) {
      setIsInitialLoading(false);
      return;
    }

    const loadInitialData = async () => {
      setIsInitialLoading(true);
      await resetAndLoad();
      setIsInitialLoading(false);
    };

    loadInitialData();
  }, [resetAndLoad]);

  return (
    <>
      <SEO
        title={t('favorites_title')}
        description={t('favorites_description')}
        path={`/${ROUTES.favorites}`}
        noindex={true}
        nofollow={true}
      />
      <Container>
        {isInitialLoading && <MainLoader fullScreen={true} />}

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
              {t('favorites_title')}
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {t('favorites_description')}
          </Typography>

          {/* Сетка карточек аниме */}
          {animeList.length > 0 ? (
            <>
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

              {/* Индикатор загрузки и статус пагинации */}
              {!isInitialLoading && !pagination.isLoading && (
                <Box ref={ref}>
                  <LoadingIndicator
                    isLoading={pagination.isLoading}
                    hasMore={pagination.hasMore}
                  />
                </Box>
              )}
            </>
          ) : (
            /* Пустое состояние */
            !isInitialLoading && (
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
                <FavoriteIcon
                  sx={{
                    fontSize: 64,
                    color: 'var(--color-text-disabled)',
                    mb: 2
                  }}
                />
                <Typography variant="h5" component="h2" gutterBottom>
                  {t('favorites_empty_title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('favorites_empty_description')}
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Container>
    </>
  );
};

export default Favorites;
