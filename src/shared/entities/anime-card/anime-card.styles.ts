import type { SxProps, Theme } from '@mui/material';

/**
 * Стили для карточки аниме
 */

export const cardStyles: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 'var(--border-radius-large)',
  backgroundColor: 'var(--color-background-paper)',
  boxShadow: 'var(--shadow-medium)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 'var(--shadow-large)',
    backgroundColor: 'var(--hover-background-color)'
  }
};

export const imageContainerStyles: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: 200,
  overflow: 'hidden',
  borderRadius: '0 0 var(--border-radius-large) var(--border-radius-large)',
  backgroundColor: 'var(--color-background-default)'
};

export const imageStyles: SxProps<Theme> = {
  maxHeight: '160px',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
};

export const favoriteButtonStyles: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  backdropFilter: 'blur(4px)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    transform: 'scale(1.1)'
  },
  '&.favorite': {
    backgroundColor: 'var(--color-primary)',
    '&:hover': {
      backgroundColor: 'var(--color-primary-dark)'
    }
  }
};

export const contentStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 2,
  gap: 1
};

export const titleStyles: SxProps<Theme> = {
  fontSize: '1.1rem',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  lineHeight: 1.3,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '2.6rem'
};

export const descriptionStyles: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'var(--color-text-secondary)',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1
};

export const compactCardStyles: SxProps<Theme> = {
  ...cardStyles,
  '& .MuiCardContent-root': {
    padding: 1.5
  }
};

export const compactImageStyles: SxProps<Theme> = {
  ...imageContainerStyles,
  height: 160
};

export const compactTitleStyles: SxProps<Theme> = {
  ...titleStyles,
  fontSize: '1rem',
  minHeight: '2rem'
};

export const compactDescriptionStyles: SxProps<Theme> = {
  ...descriptionStyles,
  WebkitLineClamp: 2
};

export const infoOverlayStyles: SxProps<Theme> = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
  padding: '12px 16px 8px',
  display: 'flex',
  gap: 1,
  flexWrap: 'wrap',
  alignItems: 'center'
};

export const infoItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  backgroundColor: 'var(--color-background-paper)',
  color: 'var(--color-text-primary)',
  padding: '4px 8px',
  borderRadius: 'var(--border-radius-small)',
  fontSize: '0.75rem',
  fontWeight: 500,
  backdropFilter: 'blur(4px)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  border: '1px solid var(--color-border)'
};

export const compactInfoOverlayStyles: SxProps<Theme> = {
  ...infoOverlayStyles,
  padding: '8px 12px 6px',
  gap: 0.5
};

export const compactInfoItemStyles: SxProps<Theme> = {
  ...infoItemStyles,
  padding: '2px 6px',
  fontSize: '0.7rem'
};

export const infoButtonStyles: SxProps<Theme> = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  backdropFilter: 'blur(4px)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    transform: 'scale(1.1)'
  }
};

export const dropdownPaperStyles: SxProps<Theme> = {
  backgroundColor: 'var(--color-background-paper)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-large)',
  boxShadow: 'var(--shadow-large)',
  overflow: 'hidden',
  transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
  transformOrigin: 'top left'
};

export const dropdownContentStyles: SxProps<Theme> = {
  padding: 2
};

export const titleSectionStyles: SxProps<Theme> = {
  marginBottom: 2,
  paddingBottom: 2,
  borderBottom: '1px solid var(--color-border)'
};

export const infoSectionStyles: SxProps<Theme> = {
  marginBottom: 2,
  '&:last-child': {
    marginBottom: 0
  }
};

export const chipContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
  marginTop: 0.5
};

export const chipStyles: SxProps<Theme> = {
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary-contrast)',
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: 'var(--color-primary-main)'
  }
};

export const ratingChipStyles: SxProps<Theme> = {
  backgroundColor: 'var(--color-secondary-main)',
  color: 'var(--color-secondary-contrast)',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'var(--color-secondary-dark)'
  }
};

export const dropdownDescriptionStyles: SxProps<Theme> = {
  color: 'var(--color-text-secondary)',
  lineHeight: 1.5,
  marginTop: 0.5
};

export const closeButtonStyles: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'var(--color-background-paper)',
  color: 'var(--color-text-secondary)',
  border: '1px solid var(--color-border)',
  '&:hover': {
    backgroundColor: 'var(--color-error-light)',
    color: 'var(--color-error-main)',
    borderColor: 'var(--color-error-main)'
  }
};

export const tooltipStyles: SxProps<Theme> = {
  backgroundColor: 'var(--color-background-paper)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-large)',
  boxShadow: 'var(--shadow-large)',
  maxWidth: 'min(calc(100vw - 32px), 360px)',
  padding: 0,
  '& .MuiTooltip-arrow': {
    color: 'var(--color-background-paper)',
    '&::before': {
      border: '1px solid var(--color-border)'
    }
  }
};
