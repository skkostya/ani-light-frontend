import {
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import { dictionariesApi } from '@/api/dictionaries.api';
import type { IGetAnimeListParams } from '@/api/types/anime.types';
import type { Genre } from '@/api/types/dictionaries.types';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

import { useUrlFilters } from '../../hooks/useUrlFilters';
import {
  actionsRowStyles,
  applyButtonStyles,
  checkboxStyles,
  filterChipStyles,
  filtersButtonStyles,
  filtersContainerStyles,
  filtersGridStyles,
  filtersPanelStyles,
  formControlStyles,
  resetButtonStyles,
  searchFieldStyles,
  searchRowStyles,
  sectionTitleStyles
} from './CatalogFilters.styles';

interface CatalogFiltersProps {
  onApplyFilters: () => void;
}

const YEARS = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() - i
);
const RATINGS = Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5);

export const CatalogFiltersComponent: React.FC<CatalogFiltersProps> = ({
  onApplyFilters
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useUrlFilters();

  const [genres, setGenres] = useState<Genre[]>([]);

  const [filters, setFilters] = useState<IGetAnimeListParams>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');

  // Debounced search для автоматического обновления URL
  const debouncedSearch = useDebouncedValue(searchInput, 500);

  const handleFilterChange = (
    key: keyof IGetAnimeListParams,
    value: string | number | boolean | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(location.search);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
      else params.delete(key);
    });
    setSearchParams(params);
    setTimeout(onApplyFilters, 100);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const hasActiveFilters =
    debouncedSearch ||
    filters.genre ||
    filters.year_from ||
    filters.year_to ||
    filters.min_rating ||
    filters.max_rating ||
    filters.is_ongoing;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (debouncedSearch) count++;
    if (filters.genre) count++;
    if (filters.year_from || filters.year_to) count++;
    if (filters.min_rating || filters.max_rating) count++;
    if (filters.is_ongoing) count++;
    return count;
  };

  // Сбрасываем фильтры в URL
  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(location.search);
    params.delete('search');
    params.delete('genre');
    params.delete('year_from');
    params.delete('year_to');
    params.delete('min_rating');
    params.delete('max_rating');
    params.delete('is_ongoing');
    setSearchParams(params, { replace: true });

    // Сбрасываем локальное состояние
    setFilters({
      search: '',
      genre: undefined,
      year_from: undefined,
      year_to: undefined,
      min_rating: undefined,
      max_rating: undefined,
      is_ongoing: undefined
    });
    setSearchInput('');
  }, []);

  // Автоматически обновляем URL при изменении debounced search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, [debouncedSearch]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genres = await dictionariesApi.getAllGenres();
        setGenres(genres);
      } catch (error) {
        console.error(error);
      }
    };
    getGenres();
  }, []);

  return (
    <Box sx={filtersContainerStyles}>
      {/* Поиск и кнопка фильтров */}
      <Stack sx={searchRowStyles}>
        <TextField
          fullWidth
          placeholder={t('catalog_search_placeholder')}
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              )
            }
          }}
          sx={searchFieldStyles}
        />

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
          className={hasActiveFilters ? 'active' : ''}
          sx={filtersButtonStyles}
        >
          {t('button_filters')}
          {hasActiveFilters && (
            <Chip
              label={getActiveFiltersCount()}
              size="small"
              color="primary"
              sx={{ ml: 1, minWidth: 20, height: 20 }}
            />
          )}
        </Button>
      </Stack>

      {/* Панель фильтров */}
      <Collapse in={showFilters}>
        <Box sx={filtersPanelStyles}>
          <Typography variant="h6" sx={sectionTitleStyles}>
            <FilterIcon />
            {t('catalog_filters_title')}
          </Typography>

          {/* Основные фильтры */}
          <Box sx={filtersGridStyles}>
            {/* Год от */}
            <FormControl sx={formControlStyles}>
              <InputLabel>{t('catalog_filter_year_from')}</InputLabel>
              <Select
                value={filters.year_from || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'year_from',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                label={t('catalog_filter_year_from')}
              >
                <MenuItem value="">
                  <em>{t('catalog_filter_all_years')}</em>
                </MenuItem>
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Год до */}
            <FormControl sx={formControlStyles}>
              <InputLabel>{t('catalog_filter_year_to')}</InputLabel>
              <Select
                value={filters.year_to || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'year_to',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                label={t('catalog_filter_year_to')}
              >
                <MenuItem value="">
                  <em>{t('catalog_filter_all_years')}</em>
                </MenuItem>
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Рейтинг от */}
            <FormControl sx={formControlStyles}>
              <InputLabel>{t('catalog_filter_rating_from')}</InputLabel>
              <Select
                value={filters.min_rating || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'min_rating',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                label={t('catalog_filter_rating_from')}
              >
                <MenuItem value="">
                  <em>Любой</em>
                </MenuItem>
                {RATINGS.map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating} ⭐
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Рейтинг до */}
            <FormControl sx={formControlStyles}>
              <InputLabel>{t('catalog_filter_rating_to')}</InputLabel>
              <Select
                value={filters.max_rating || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'max_rating',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                label={t('catalog_filter_rating_to')}
              >
                <MenuItem value="">
                  <em>Любой</em>
                </MenuItem>
                {RATINGS.map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating} ⭐
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Жанр */}
            <FormControl sx={formControlStyles}>
              <InputLabel>{t('catalog_filter_genre')}</InputLabel>
              <Select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                label={t('catalog_filter_genre')}
              >
                <MenuItem value="">
                  <em>{t('catalog_filter_all_genres')}</em>
                </MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Только продолжающиеся */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.is_ongoing || false}
                  onChange={(e) =>
                    handleFilterChange('is_ongoing', e.target.checked)
                  }
                  sx={checkboxStyles}
                />
              }
              label={t('catalog_filter_ongoing')}
              sx={{
                alignItems: 'center',
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.9rem'
                }
              }}
            />
          </Box>

          {/* Активные фильтры */}
          {hasActiveFilters && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {t('catalog_active_filters')}:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {debouncedSearch && (
                  <Chip
                    label={`Поиск: "${debouncedSearch}"`}
                    onDelete={() => {
                      setSearchInput('');
                      const params = new URLSearchParams(searchParams);
                      params.delete('search');
                      setSearchParams(params);
                    }}
                    sx={filterChipStyles}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.genre && (
                  <Chip
                    label={`Жанр: ${filters.genre}`}
                    onDelete={() => handleFilterChange('genre', undefined)}
                    sx={filterChipStyles}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {(filters.year_from || filters.year_to) && (
                  <Chip
                    label={`Год: ${filters.year_from || '∞'} - ${filters.year_to || '∞'}`}
                    onDelete={() => {
                      handleFilterChange('year_from', undefined);
                      handleFilterChange('year_to', undefined);
                    }}
                    sx={filterChipStyles}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {(filters.min_rating || filters.max_rating) && (
                  <Chip
                    label={`Рейтинг: ${filters.min_rating || '0'} - ${filters.max_rating || '5'} ⭐`}
                    onDelete={() => {
                      handleFilterChange('min_rating', undefined);
                      handleFilterChange('max_rating', undefined);
                    }}
                    sx={filterChipStyles}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.is_ongoing && (
                  <Chip
                    label="Только продолжающиеся"
                    onDelete={() => handleFilterChange('is_ongoing', false)}
                    sx={filterChipStyles}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Кнопки действий */}
          <Stack sx={actionsRowStyles}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              className="anime-gradient-sunset"
              sx={applyButtonStyles}
            >
              {t('button_apply_filters')}
            </Button>

            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={resetButtonStyles}
            >
              {t('button_reset_filters')}
            </Button>

            <Button
              variant="outlined"
              onClick={() => setShowFilters(false)}
              sx={resetButtonStyles}
            >
              {t('anime_info_dropdown_close')}
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};
