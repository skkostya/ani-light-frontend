import { Box, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/shared/constants';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { getClientToken } from '@/shared/services/user-hash';
import { LoadingIndicator, MainLoader, SEO } from '@/shared/ui';

import { useHistoryPagination } from './hooks';
import { HistorySection } from './ui/HistorySection';

const History: React.FC = () => {
  const { t } = useTranslation();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { groupedHistory, sortedDates, pagination, loadMore, resetAndLoad } =
    useHistoryPagination();

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
      sortedDates.length > 0 // Загружаем только если уже есть данные
    ) {
      loadMore();
    }
  }, [
    isIntersecting,
    pagination.hasMore,
    pagination.isLoading,
    sortedDates.length,
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
  }, []);

  return (
    <>
      <SEO
        title={t('history_title')}
        description={t('history_description')}
        path={`/${ROUTES.history}`}
        noindex={true}
        nofollow={true}
      />
      <Container>
        {isInitialLoading && <MainLoader fullScreen={true} />}

        <Box sx={{ py: 4 }}>
          {/* Заголовок страницы */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 0 }}>
              {t('history_title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('history_description')}
            </Typography>
          </Box>

          {/* Список истории по датам */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {sortedDates.map((date) => (
              <HistorySection
                key={date}
                date={date}
                entries={groupedHistory[date]}
              />
            ))}
          </Box>

          {/* Индикатор загрузки и статус пагинации */}
          {sortedDates.length > 0 &&
            !isInitialLoading &&
            !pagination.isLoading && (
              <Box ref={ref}>
                <LoadingIndicator
                  isLoading={pagination.isLoading}
                  hasMore={pagination.hasMore}
                />
              </Box>
            )}

          {/* Пустое состояние */}
          {sortedDates.length === 0 && !isInitialLoading && (
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
              <Typography variant="h5" gutterBottom>
                {t('history_empty_title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('history_empty_description')}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default History;
