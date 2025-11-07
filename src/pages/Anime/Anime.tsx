import { Home, Refresh, VideoLibrary } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';

import { episodeApi } from '@/api/episode.api';
import type { GetNextEpisodeResponse } from '@/api/types/episode.types';
import { storageApi } from '@/local-storage-api/storage.api';
import { ROUTES } from '@/shared/constants';
import { useAppNavigate } from '@/shared/hooks/useAppNavigate';
import {
  LocalizedLink,
  MainLoader,
  SEO,
  StructuredData,
  createVideoObjectData
} from '@/shared/ui';
import { getEpisodeDetails } from '@/store/episode.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { animePageStyles } from './Anime.styles';
import { AnimeControls, AnimePlayer, RecentEpisodes } from './ui';

const Anime = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigate();
  const dispatch = useAppDispatch();
  const { episode } = useAppSelector((state) => state.episode);

  const { alias } = useParams<{ alias: string }>();
  const [searchParams] = useSearchParams();
  const seasonNumber = searchParams.get('season');
  const episodeNumber = searchParams.get('episode');

  const animePageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [nextEpisode, setNextEpisode] = useState<GetNextEpisodeResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем настройки из localStorage
  const [autoSkipOpening, setAutoSkipOpening] = useState(() => {
    const settings = storageApi.getPlayerSettings();
    return settings.auto_skip ?? false;
  });

  const [autoNextEpisode, setAutoNextEpisode] = useState(() => {
    const settings = storageApi.getPlayerSettings();
    return settings.auto_next ?? false;
  });

  // Сохраняем настройки при изменении
  useEffect(() => {
    storageApi.updatePlayerSettings({
      auto_skip: autoSkipOpening,
      auto_next: autoNextEpisode
    });
  }, [autoSkipOpening, autoNextEpisode]);

  useEffect(() => {
    if (!alias || !seasonNumber || !episodeNumber) return;
    const loadEpisode = async () => {
      setIsLoading(true);
      const response = await dispatch(
        getEpisodeDetails({
          alias,
          seasonNumber: parseInt(seasonNumber),
          number: parseInt(episodeNumber)
        })
      );

      if (getEpisodeDetails.rejected.match(response)) {
        console.error(response.error);
      }

      try {
        const nextEpisodeResponse = await episodeApi.getNextEpisode({
          alias,
          seasonNumber: parseInt(seasonNumber),
          number: parseInt(episodeNumber)
        });
        setNextEpisode(nextEpisodeResponse);
      } catch (err) {
        console.error(err);
      }

      setIsLoading(false);
    };
    loadEpisode();
  }, [alias, seasonNumber, episodeNumber, dispatch]);

  // Структурированные данные для SEO
  const structuredData = useMemo(() => {
    if (!episode) return null;

    const episodeTitle = `${episode.animeRelease.title_ru} - Серия ${episode.number}`;
    const duration = episode.duration
      ? `PT${Math.floor(episode.duration / 60)}M${episode.duration % 60}S`
      : undefined;

    return createVideoObjectData(
      episodeTitle,
      `Смотреть ${episode.animeRelease.title_ru} серия ${episode.number} онлайн`,
      episode.preview_image,
      undefined,
      duration,
      episode.animeRelease.title_ru
    );
  }, [episode]);

  useEffect(() => {
    const top = titleRef.current ? titleRef.current?.offsetTop - 74 : 0;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [episode?.id]);

  if (!episode) {
    const handleRefresh = () => {
      window.location.reload();
    };

    return (
      <Box sx={animePageStyles.container}>
        {isLoading && <MainLoader fullScreen />}

        <Box sx={animePageStyles.notFoundContainer}>
          {/* Иконка */}
          <Box sx={animePageStyles.notFoundIcon}>
            <VideoLibrary />
          </Box>

          {/* Заголовок */}
          <Typography
            variant="h3"
            component="h1"
            sx={animePageStyles.notFoundTitle}
          >
            {t('anime_episode_not_found_title')}
          </Typography>

          {/* Описание */}
          <Typography variant="body1" sx={animePageStyles.notFoundDescription}>
            {t('anime_episode_not_found_description')}
          </Typography>

          {/* Предложение */}
          <Typography variant="body2" sx={animePageStyles.notFoundSuggestion}>
            {t('anime_episode_not_found_suggestion')}
          </Typography>

          {/* Кнопки действий */}
          <Box sx={animePageStyles.notFoundButtons}>
            <Button
              component={LocalizedLink}
              to={ROUTES.catalog}
              variant="contained"
              startIcon={<Home />}
              sx={animePageStyles.notFoundButton}
            >
              {t('anime_episode_not_found_button_catalog')}
            </Button>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={animePageStyles.notFoundButton}
            >
              {t('anime_episode_not_found_button_refresh')}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  const handleNextEpisode = () => {
    const nextSeasonSortOrder = nextEpisode?.seasonSortOrder
      ? String(nextEpisode.seasonSortOrder)
      : undefined;
    const nextEpisodeNumber = nextEpisode?.nextEpisodeNumber;
    if (!nextEpisodeNumber) return;
    navigate(
      ROUTES.anime(alias, {
        episodeNumber: String(nextEpisodeNumber),
        seasonNumber: nextSeasonSortOrder ?? seasonNumber ?? undefined
      })
    );
    storageApi.removeWatchingTime(
      episode?.animeRelease.external_id,
      episode?.number
    );
  };

  return (
    <>
      <SEO
        title={
          episode
            ? `${episode.animeRelease.title_ru} - Серия ${episode.number}`
            : t('anime_episode_not_found_title')
        }
        description={
          episode
            ? `Смотреть ${episode.animeRelease.title_ru} серия ${episode.number} онлайн в хорошем качестве`
            : t('anime_episode_not_found_description')
        }
        image={episode?.preview_image || episode?.animeRelease.poster_url}
        path={
          alias && seasonNumber && episodeNumber
            ? ROUTES.anime(alias, { seasonNumber, episodeNumber })
            : ''
        }
        type="video"
        noindex={!episode}
        structuredData={structuredData || undefined}
      />
      {structuredData && <StructuredData data={structuredData} />}
      <Box
        ref={animePageRef}
        sx={animePageStyles.container}
        data-next-season-sort-order={nextEpisode?.seasonSortOrder}
        data-next-episode-number={nextEpisode?.nextEpisodeNumber}
        data-season-external-id={episode?.animeRelease.external_id}
        data-current-episode-number={episode?.number}
        data-auto-skip-opening={autoSkipOpening}
        data-auto-next-episode={autoNextEpisode}
      >
        <Container maxWidth="lg">
          {/* Toggle переключатели */}
          <Box sx={animePageStyles.togglesContainer}>
            {/* Toggle для пропуска опенинга */}
            <Box sx={animePageStyles.toggleItem}>
              <Box sx={animePageStyles.toggleLabel}>
                <Typography sx={animePageStyles.toggleTitle}>
                  {t('anime_player_toggle_skip_opening')}
                </Typography>
                <Typography sx={animePageStyles.toggleDescription}>
                  {t('anime_player_toggle_skip_opening_description')}
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSkipOpening}
                    onChange={(e) => setAutoSkipOpening(e.target.checked)}
                    sx={animePageStyles.toggleSwitch}
                  />
                }
                label=""
              />
            </Box>

            {/* Toggle для автопереключения серий */}
            <Box sx={animePageStyles.toggleItem}>
              <Box sx={animePageStyles.toggleLabel}>
                <Typography sx={animePageStyles.toggleTitle}>
                  {t('anime_player_toggle_auto_next')}
                </Typography>
                <Typography sx={animePageStyles.toggleDescription}>
                  {t('anime_player_toggle_auto_next_description')}
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoNextEpisode}
                    onChange={(e) => setAutoNextEpisode(e.target.checked)}
                    sx={animePageStyles.toggleSwitch}
                  />
                }
                label=""
              />
            </Box>
          </Box>

          <div ref={titleRef}>
            <Box sx={animePageStyles.title}>
              {episode.animeRelease.title_ru}
              <p>{episode.number} серия</p>
            </Box>
          </div>

          {/* Плеер */}
          <Box sx={animePageStyles.playerContainer}>
            <AnimePlayer animePageRef={animePageRef} />
          </Box>

          {/* Кнопки управления */}
          <Box sx={animePageStyles.controlsContainer}>
            <AnimeControls
              onNextEpisode={
                nextEpisode?.nextEpisodeNumber ? handleNextEpisode : undefined
              }
            />
          </Box>

          {/* Последние просмотренные серии */}
          <RecentEpisodes />

          {/* Комментарии */}
          {/* <AnimeComments episodeId={episode.id} /> */}
        </Container>
      </Box>
    </>
  );
};

export default Anime;
