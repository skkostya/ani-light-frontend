import { useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

import { animeApi } from '@/api/anime.api';
import type { Anime } from '@/shared/entities/anime-card/anime-card.types';

import type { PaginationState } from '../types';
import { useUrlFilters } from './useUrlFilters';

export const useCatalogPagination = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLoadingRef = useRef(false);

  const filters = useUrlFilters();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: isMobile ? 15 : 25,
    total: 0,
    totalPages: 0,
    hasMore: true,
    isLoading: false
  });

  // Обновляем лимит при изменении размера экрана
  useEffect(() => {
    const newLimit = isMobile ? 15 : 25;
    setPagination((prev) => ({
      ...prev,
      limit: newLimit
    }));
  }, [isMobile]);

  const loadAnime = async (page: number, reset = false) => {
    // Защита от повторных запросов
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setPagination((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await animeApi.getAnimeList({
        search: filters.debouncedSearch,
        genre: filters.genre,
        year_from: filters.year_from,
        year_to: filters.year_to,
        min_rating: filters.min_rating,
        max_rating: filters.max_rating,
        is_ongoing: filters.is_ongoing,
        page,
        limit: pagination.limit
      });

      const newAnimeList = response.data.map((item) => {
        const firstRelease = item.animeReleases[0];
        const userAnime = item.userAnime?.[0];
        const isOnGoing = item.animeReleases.some(
          (release) => release.is_ongoing
        );
        const genres = item.animeReleases
          .flatMap(
            (release) =>
              release.animeGenres?.map((genre) => genre.genre.name) || ''
          )
          .filter(Boolean);
        return {
          id: item.id,
          alias: item.alias,
          title: item.name,
          originalTitle: item.name_english,
          description: firstRelease?.description || '',
          imageUrl: item.image || firstRelease?.poster_url || '',
          isFavorite: userAnime?.is_favorite || false,
          isWantToWatch: userAnime?.want_to_watch || false,
          genres: genres,
          year: item.last_year,
          seasons: item.total_releases,
          episodes: item.total_episodes,
          onGoing: isOnGoing,
          dominantColor: item.accent_colors?.dominant
        };
      });

      setAnimeList((prev) =>
        reset ? newAnimeList : [...prev, ...newAnimeList]
      );

      setPagination((prev) => ({
        ...prev,
        page: response.pagination.page,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
        hasMore: response.pagination.totalPages > response.pagination.page,
        isLoading: false
      }));
    } catch (error) {
      console.error(error);
      setPagination((prev) => ({ ...prev, isLoading: false }));
    } finally {
      isLoadingRef.current = false;
    }
  };

  const loadMore = () => {
    if (pagination.hasMore && !isLoadingRef.current && animeList.length > 0) {
      loadAnime(pagination.page + 1);
    }
  };

  const resetAndLoad = async () => {
    setIsInitialLoading(true);
    setAnimeList([]);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      hasMore: true
    }));
    await loadAnime(1, true);
    setIsInitialLoading(false);
  };

  const updateAnimeInList = useCallback(
    (animeId: string, updates: Partial<Anime>) => {
      setAnimeList((prev) =>
        prev.map((anime) =>
          anime.id === animeId ? { ...anime, ...updates } : anime
        )
      );
    },
    []
  );

  // Загружаем начальные данные при изменении фильтров
  useEffect(() => {
    resetAndLoad();
  }, [
    filters.debouncedSearch,
    filters.genre,
    filters.year_from,
    filters.year_to,
    filters.min_rating,
    filters.max_rating,
    filters.is_ongoing
  ]);

  return {
    isInitialLoading,
    animeList,
    pagination,
    loadMore,
    resetAndLoad,
    updateAnimeInList
  };
};
