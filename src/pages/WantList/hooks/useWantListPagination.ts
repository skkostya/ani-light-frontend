import { useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

import { userApi } from '@/api/user.api';
import type { Anime } from '@/shared/entities/anime-card/anime-card.types';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
}

export const useWantListPagination = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLoadingRef = useRef(false);

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

  const loadWantList = useCallback(
    async (page: number, reset = false) => {
      // Защита от повторных запросов
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setPagination((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await userApi.getWantToWatchAnime({
          page,
          limit: pagination.limit
        });

        const newAnimeList = response.data.map((item) => {
          const firstRelease = item.anime.animeReleases?.[0];
          const isOnGoing =
            item.anime.animeReleases?.some((release) => release.is_ongoing) ||
            false;
          const genres =
            item.anime.animeReleases?.flatMap(
              (release) =>
                release.animeGenres?.map((genre) => genre.genre.name) || ''
            ) || [];

          return {
            id: item.anime.id,
            alias: item.anime.alias,
            title: item.anime.name,
            originalTitle: item.anime.name_english,
            description: firstRelease?.description || '',
            imageUrl: item.anime.image || firstRelease?.poster_url || '',
            isFavorite: item.is_favorite,
            isWantToWatch: item.want_to_watch,
            genres: genres,
            year: item.anime.last_year,
            seasons: item.anime.total_releases,
            episodes: item.anime.total_episodes,
            onGoing: isOnGoing,
            dominantColor: item.anime.accent_colors?.[0]?.dominant
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
    },
    [pagination.limit]
  );

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !isLoadingRef.current && animeList.length > 0) {
      loadWantList(pagination.page + 1);
    }
  }, [pagination.hasMore, pagination.page, animeList.length, loadWantList]);

  const resetAndLoad = useCallback(async () => {
    setAnimeList([]);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      hasMore: true
    }));
    await loadWantList(1, true);
  }, [loadWantList]);

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

  return {
    animeList,
    pagination,
    loadMore,
    resetAndLoad,
    updateAnimeInList
  };
};
