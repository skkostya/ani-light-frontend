import type { SxProps, Theme } from '@mui/material';

export const animeControlsStyles = {
  container: {
    width: '100%'
  } as SxProps<Theme>,

  controlButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    minWidth: { xs: 'auto', sm: 160 },
    py: { xs: 1.5, sm: 2 },
    px: { xs: 2, sm: 3 },
    fontSize: { xs: '0.9rem', sm: '1rem' },
    fontWeight: 600,
    borderRadius: 'var(--border-radius-large)',
    textTransform: 'none',
    transition: 'all 0.3s ease-in-out',
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-medium)'
    },
    '&.MuiButton-contained': {
      background: 'var(--gradient-magic)',
      color: 'white',
      border: 'none',
      '&:hover': {
        background: 'var(--gradient-magic)',
        boxShadow: 'var(--shadow-glow)'
      }
    },
    '&.MuiButton-outlined': {
      borderColor: 'var(--color-primary)',
      color: 'var(--color-primary)',
      '&:hover': {
        borderColor: 'var(--color-primary)',
        backgroundColor: 'rgba(233, 30, 99, 0.04)',
        color: 'var(--color-primary)'
      }
    }
  } as SxProps<Theme>
};
