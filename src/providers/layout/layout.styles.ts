import type { SxProps, Theme } from '@mui/material';

/**
 * Стили для компонента Layout
 */

export const mainContentStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--color-background)',
  pt: { xs: 0, md: 0 }, // Отступ сверху для навигации на десктопе
  pb: { xs: '68px', md: 0 } // Отступ снизу для нижней навигации на мобильных
};
