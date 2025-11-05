import type { SxProps, Theme } from '@mui/material';

export const animePageStyles = {
  container: {
    flex: 1,
    backgroundColor: 'var(--color-background)',
    py: { xs: 2, sm: 3, md: 4 }
  } as SxProps<Theme>,

  header: {
    mb: { xs: 3, sm: 4 },
    textAlign: 'center'
  } as SxProps<Theme>,

  title: {
    background: 'var(--gradient-magic)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
    mb: 2,
    textShadow: '0 0 20px rgba(233, 30, 99, 0.3)'
  } as SxProps<Theme>,

  playerContainer: {
    maxWidth: '768px',
    margin: '0 auto',
    mb: { xs: 3, sm: 4 },
    borderRadius: 'var(--border-radius-large)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-large)',
    backgroundColor: 'var(--color-background-paper)',
    border: '2px solid var(--color-primary)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--gradient-magic)',
      opacity: 0.1,
      zIndex: 1,
      pointerEvents: 'none'
    }
  } as SxProps<Theme>,

  controlsContainer: {
    mb: { xs: 3, sm: 4 },
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '768px',
    margin: '0 auto',
    gap: { xs: 2, sm: 3 }
  } as SxProps<Theme>,

  recentContainer: {
    mt: { xs: 4, sm: 5 }
  } as SxProps<Theme>,

  recentTitle: {
    color: 'var(--color-text-primary)',
    fontWeight: 600,
    mb: { xs: 2, sm: 3 },
    textAlign: 'center',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 60,
      height: 3,
      background: 'var(--gradient-magic)',
      borderRadius: 'var(--border-radius-small)'
    }
  } as SxProps<Theme>,

  // Стили для страницы "эпизод не найден"
  notFoundContainer: {
    minHeight: { xs: '50vh', sm: '60vh' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: { xs: 2, sm: 4, md: 6 },
    px: { xs: 1, sm: 3, md: 4 },
    textAlign: 'center',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden'
  } as SxProps<Theme>,

  notFoundIcon: {
    color: 'primary.main',
    mb: { xs: 2, sm: 3 },
    opacity: 0.8,
    animation: 'animePulse 2s ease-in-out infinite',
    '& svg': {
      width: { xs: '60px', sm: '70px', md: '80px' },
      height: { xs: '60px', sm: '70px', md: '80px' },
      filter: 'drop-shadow(0 0 20px rgba(233, 30, 99, 0.3))'
    },
    '@keyframes animePulse': {
      '0%': {
        transform: 'scale(1)',
        opacity: 0.8
      },
      '50%': {
        transform: 'scale(1.05)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 0.8
      }
    }
  } as SxProps<Theme>,

  notFoundTitle: {
    fontWeight: 700,
    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.25rem', lg: '2.75rem' },
    lineHeight: { xs: 1.3, sm: 1.2 },
    mb: { xs: 2, sm: 3 },
    background: 'var(--gradient-magic)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    textShadow: '0 0 30px rgba(233, 30, 99, 0.3)',
    px: { xs: 1, sm: 0 },
    wordBreak: 'break-word',
    hyphens: 'auto'
  } as SxProps<Theme>,

  notFoundDescription: {
    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.125rem' },
    lineHeight: { xs: 1.5, sm: 1.6 },
    color: 'text.secondary',
    maxWidth: { xs: '100%', sm: '500px' },
    mx: 'auto',
    mb: { xs: 1.5, sm: 2 },
    px: { xs: 0.5, sm: 0 },
    wordBreak: 'break-word',
    hyphens: 'auto'
  } as SxProps<Theme>,

  notFoundSuggestion: {
    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '1rem' },
    lineHeight: { xs: 1.4, sm: 1.5 },
    color: 'text.secondary',
    maxWidth: { xs: '100%', sm: '400px' },
    mx: 'auto',
    mb: { xs: 3, sm: 4 },
    fontStyle: 'italic',
    px: { xs: 0.5, sm: 0 },
    wordBreak: 'break-word',
    hyphens: 'auto'
  } as SxProps<Theme>,

  notFoundButtons: {
    mt: { xs: 3, sm: 4 },
    display: 'flex',
    gap: { xs: 2, sm: 2 },
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    px: { xs: 2, sm: 0 },
    width: '100%',
    maxWidth: { xs: '100%', sm: '400px' },
    mx: 'auto'
  } as SxProps<Theme>,

  notFoundButton: {
    width: '100%',
    maxWidth: { xs: '280px', sm: '200px', md: '220px' },
    height: { xs: '48px', sm: '44px', md: '48px' },
    borderRadius: 'var(--border-radius-large)',
    fontWeight: 600,
    fontSize: { xs: '0.9rem', sm: '0.875rem', md: '1rem' },
    textTransform: 'none',
    boxShadow: 'var(--shadow-small)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-2px)' },
      boxShadow: 'var(--shadow-medium)',
      '&.MuiButton-contained': {
        background: 'var(--gradient-sunset)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 3s ease infinite'
      },
      '&.MuiButton-outlined': {
        borderColor: 'primary.main',
        color: 'primary.main',
        backgroundColor: 'var(--color-background-elevated)'
      }
    },
    '&:active': {
      transform: { xs: 'scale(0.98)', sm: 'translateY(-2px)' }
    },
    '&.MuiButton-contained': {
      background: 'var(--gradient-magic)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 3s ease infinite',
      '&:hover': {
        background: 'var(--gradient-sunset)'
      }
    },
    '&.MuiButton-outlined': {
      borderColor: 'primary.main',
      color: 'primary.main',
      borderWidth: '2px',
      '&:hover': {
        borderWidth: '2px'
      }
    },
    '@keyframes gradientShift': {
      '0%': {
        backgroundPosition: '0% 50%'
      },
      '50%': {
        backgroundPosition: '100% 50%'
      },
      '100%': {
        backgroundPosition: '0% 50%'
      }
    }
  } as SxProps<Theme>,

  togglesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    mb: 2,
    p: 2,
    maxWidth: '768px',
    marginInline: 'auto',
    borderRadius: 'var(--border-radius-medium)',
    backgroundColor: 'var(--color-background-paper)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-small)'
  } as SxProps<Theme>,

  toggleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    p: 1.5,
    borderRadius: 'var(--border-radius-small)',
    backgroundColor: 'var(--color-background)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: 'var(--color-background-hover)'
    }
  } as SxProps<Theme>,

  toggleLabel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5
  } as SxProps<Theme>,

  toggleTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)'
  } as SxProps<Theme>,

  toggleDescription: {
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.4
  } as SxProps<Theme>,

  toggleSwitch: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: 'var(--color-primary)',
      '&:hover': {
        backgroundColor: 'rgba(233, 30, 99, 0.08)'
      }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: 'var(--color-primary)'
    },
    '& .MuiSwitch-track': {
      backgroundColor: 'var(--color-border)'
    }
  } as SxProps<Theme>
};
