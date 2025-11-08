import './anime-info-dropdown.scss';

import { Info } from '@mui/icons-material';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  chipContainerStyles,
  chipStyles,
  dropdownContentStyles,
  dropdownDescriptionStyles,
  infoSectionStyles,
  ratingChipStyles,
  titleSectionStyles,
  tooltipStyles
} from './anime-card.styles';
import type { Anime } from './anime-card.types';

interface AnimeInfoDropdownProps {
  anime: Anime;
}

/**
 * Компонент Tooltip с подробной информацией об аниме
 */
export const AnimeInfoDropdown: React.FC<AnimeInfoDropdownProps> = ({
  anime
}) => {
  const { t } = useTranslation();

  const genres =
    anime.genres && anime.genres.length > 0 ? [...new Set(anime.genres)] : [];

  const tooltipContent = (
    <Box sx={dropdownContentStyles}>
      {/* Заголовок и основная информация */}
      <Box sx={titleSectionStyles}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          {anime.title}
        </Typography>
        {anime.originalTitle && (
          <Typography variant="body2" color="text.secondary">
            {anime.originalTitle}
          </Typography>
        )}
        {anime.year && (
          <Typography variant="body2" color="text.secondary">
            {anime.year}
          </Typography>
        )}
      </Box>

      {/* Рейтинг */}
      {anime.rating && (
        <Box sx={infoSectionStyles}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t('anime_rating')}
          </Typography>
          <Chip
            label={`${anime.rating}/10`}
            sx={ratingChipStyles}
            size="small"
          />
        </Box>
      )}

      {/* Жанры */}
      {genres.length > 0 && (
        <Box sx={infoSectionStyles}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t('anime_genres')}
          </Typography>
          <Box sx={chipContainerStyles}>
            {genres.map((genre, index) => (
              <Chip key={index} label={genre} size="small" sx={chipStyles} />
            ))}
          </Box>
        </Box>
      )}

      {/* Темы */}
      {anime.themes && anime.themes.length > 0 && (
        <Box sx={infoSectionStyles}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t('anime_themes')}
          </Typography>
          <Box sx={chipContainerStyles}>
            {anime.themes.map((theme, index) => (
              <Chip key={index} label={theme} size="small" sx={chipStyles} />
            ))}
          </Box>
        </Box>
      )}

      {/* Полное описание */}
      {(anime.fullDescription || anime.description) && (
        <Box sx={infoSectionStyles}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t('anime_description')}
          </Typography>
          <Typography variant="body2" sx={dropdownDescriptionStyles}>
            {anime.fullDescription || anime.description}
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <div className="anime-info-dropdown">
      <Tooltip
        title={tooltipContent}
        arrow
        placement="right-start"
        slotProps={{
          tooltip: {
            sx: tooltipStyles
          }
        }}
      >
        <IconButton
          className="anime-info-dropdown__info-button"
          aria-label={t('anime_info_dropdown_toggle')}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Info />
        </IconButton>
      </Tooltip>
    </div>
  );
};
