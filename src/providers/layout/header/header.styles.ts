import type { SxProps, Theme } from '@mui/material';

/**
 * Стили для компонента Header
 */

export const appBarStyles: SxProps<Theme> = {
  position: 'sticky',
  elevation: 0,
  backgroundColor: 'var(--color-background-paper)',
  borderBottom: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-small)',
  zIndex: (theme) => theme.zIndex.appBar
};

export const toolbarStyles: SxProps<Theme> = {
  minHeight: { xs: 56, md: 64 },
  px: { xs: 0, md: 0 },
  py: { xs: 1.5, md: 2 },
  gap: 2,
  // Ограничиваем ширину и центрируем как контент
  width: 'var(--container-width)',
  maxWidth: '1280px',
  margin: '0 auto',
  borderRadius: {
    xs: 0,
    md: '0 0 var(--border-radius-large) var(--border-radius-large)'
  }
};

export const logoContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
};

export const logoTextStyles: SxProps<Theme> = {
  fontWeight: 700,
  background: 'var(--gradient-magic)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: { xs: '1.5rem', md: '1.75rem' }
};

export const searchFormStyles: SxProps<Theme> = {
  flexGrow: 1,
  maxWidth: { xs: '100%', md: 400 },
  mx: { xs: 0, md: 2 }
};

export const controlsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: { xs: 0.5, md: 1 },
  marginLeft: 'auto' // Прижимаем к правому краю
};

export const authButtonStyles: SxProps<Theme> = {
  borderRadius: 'var(--border-radius-medium)',
  textTransform: 'none',
  fontWeight: 600,
  px: 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-medium)'
  }
};

export const authIconButtonStyles: SxProps<Theme> = {
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    color: 'primary.main'
  }
};
