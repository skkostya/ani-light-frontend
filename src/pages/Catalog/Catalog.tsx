import { Box, Container, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { userApi } from '@/api/user.api';
import { ROUTES } from '@/shared/constants';
import { toast } from '@/shared/entities';
import { AnimeCard } from '@/shared/entities/anime-card';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import {
  Grid,
  LoadingIndicator,
  MainLoader,
  SEO,
  StructuredData,
  createCollectionPageData
} from '@/shared/ui';

import { useCatalogPagination } from './hooks/useCatalogPagination';
import { CatalogFilters as CatalogFiltersComponent } from './ui';

const Catalog: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  const {
    isInitialLoading,
    animeList,
    pagination,
    loadMore,
    resetAndLoad,
    updateAnimeInList
  } = useCatalogPagination();

  // Структурированные данные для SEO
  const structuredData = createCollectionPageData(
    t('catalog_title'),
    t('catalog_description'),
    lang || 'ru'
  );

  const handleToggleFavorite = useCallback(
    async (animeId: string) => {
      // Сначала находим исходное состояние
      const originalAnime = animeList.find((a) => a.id === animeId);
      if (!originalAnime) return;

      const wasFavorite = originalAnime.isFavorite;

      // Оптимистичное обновление UI
      updateAnimeInList(animeId, { isFavorite: !wasFavorite });

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
        // В случае ошибки возвращаем исходное состояние
        updateAnimeInList(animeId, { isFavorite: wasFavorite });
      }
    },
    [animeList]
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
    [animeList]
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
      // Первая загрузка данных в useCatalogPagination
      loadMore();
    }
  }, [
    isIntersecting,
    pagination.hasMore,
    pagination.isLoading,
    animeList.length
  ]);

  return (
    <>
      <SEO
        title={t('catalog_title')}
        description={t('catalog_description')}
        path={`/${ROUTES.catalog}`}
        keywords={[
          'каталог аниме',
          'поиск аниме',
          'фильтры аниме',
          'популярное аниме',
          'новое аниме',
          'топ аниме',
          'аниме по жанрам',
          'аниме по годам'
        ]}
        type="website"
        structuredData={structuredData}
      />
      <StructuredData data={structuredData} />
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
              {t('catalog_title')}
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {t('catalog_description')}
          </Typography>

          {/* Фильтры */}
          <CatalogFiltersComponent onApplyFilters={resetAndLoad} />

          {/* Сетка карточек аниме */}
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
          {animeList.length > 0 && !isInitialLoading && (
            <>
              <Box>
                <LoadingIndicator
                  isLoading={pagination.isLoading}
                  hasMore={pagination.hasMore}
                />
              </Box>
              {!pagination.isLoading && <Box ref={ref} />}
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Catalog;
