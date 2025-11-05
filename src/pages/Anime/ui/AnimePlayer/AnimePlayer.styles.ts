import type { SxProps, Theme } from '@mui/material';

export const animePlayerStyles = {
  container: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: 'var(--border-radius-large)',
    overflow: 'hidden',
    backgroundColor: '#000',
    boxShadow: 'var(--shadow-large)'
  } as SxProps<Theme>,

  playerWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    '& .artplayer': {
      borderRadius: 'var(--border-radius-large)',
      overflow: 'hidden'
    }
  } as SxProps<Theme>,

  playerPlaceholder: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  } as SxProps<Theme>,

  placeholderContent: {
    textAlign: 'center',
    zIndex: 2,
    position: 'relative'
  } as SxProps<Theme>,

  placeholderTitle: {
    color: 'white',
    fontWeight: 700,
    mb: 2,
    textShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
  } as SxProps<Theme>,

  placeholderSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    mb: 4,
    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
    textShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
  } as SxProps<Theme>,

  playButton: {
    background: 'var(--gradient-magic)',
    color: 'white',
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: 'var(--border-radius-large)',
    boxShadow: 'var(--shadow-glow)',
    textTransform: 'none',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(233, 30, 99, 0.4)',
      background: 'var(--gradient-magic)'
    },
    '&:active': {
      transform: 'translateY(0)'
    },
    transition: 'all 0.3s ease-in-out'
  } as SxProps<Theme>,

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  } as SxProps<Theme>,

  loadingContent: {
    textAlign: 'center',
    color: 'white'
  } as SxProps<Theme>,

  loadingSpinner: {
    width: 48,
    height: 48,
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    mb: 2
  } as SxProps<Theme>,

  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  } as SxProps<Theme>,

  errorContent: {
    textAlign: 'center',
    color: 'white',
    p: 3
  } as SxProps<Theme>,

  errorIcon: {
    fontSize: 64,
    color: 'var(--color-primary)'
  } as SxProps<Theme>,

  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: 600
  } as SxProps<Theme>,

  errorMessage: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    mb: 1
  } as SxProps<Theme>,

  retryButton: {
    background: 'var(--gradient-magic)',
    color: 'white',
    px: 3,
    py: 1,
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: 'var(--border-radius-medium)',
    textTransform: 'none',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(233, 30, 99, 0.4)'
    },
    transition: 'all 0.3s ease-in-out'
  } as SxProps<Theme>,

  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none'
  } as SxProps<Theme>,

  glowCircle1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: 100,
    height: 100,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    animation: 'anime-float 6s ease-in-out infinite'
  } as SxProps<Theme>,

  glowCircle2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: 60,
    height: 60,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
    animation: 'anime-float 8s ease-in-out infinite reverse'
  } as SxProps<Theme>,

  glowCircle3: {
    position: 'absolute',
    bottom: '20%',
    left: '20%',
    width: 80,
    height: 80,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
    animation: 'anime-float 10s ease-in-out infinite'
  } as SxProps<Theme>
};
