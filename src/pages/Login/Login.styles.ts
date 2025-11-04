import type { SxProps, Theme } from '@mui/material';

/**
 * Стили для страницы авторизации
 */
export const containerStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)'
      : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
  padding: { xs: 2, sm: 3 },
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, rgba(233, 30, 99, 0.03) 0%, rgba(0, 188, 212, 0.03) 100%)'
        : 'linear-gradient(45deg, rgba(233, 30, 99, 0.02) 0%, rgba(0, 188, 212, 0.02) 100%)',
    zIndex: 0
  }
};

export const formStyles: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  borderRadius: 'var(--border-radius-xl)',
  background: 'var(--color-background-paper)',
  boxShadow: 'var(--shadow-large)',
  border: '1px solid var(--color-border)',
  backdropFilter: 'blur(10px)',
  maxWidth: 480,
  width: '100%',
  '&:hover': {
    boxShadow: 'var(--shadow-glow)',
    transform: 'translateY(-4px)',
    transition: 'all 0.3s ease-in-out'
  }
};

export const headerStyles: SxProps<Theme> = {
  textAlign: 'center',
  mb: 3,
  '& .MuiTypography-h3, .MuiTypography-h4': {
    background: 'var(--gradient-magic)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 2px 4px rgba(233, 30, 99, 0.3))'
  }
};

export const formContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

export const descriptionStyles: SxProps<Theme> = {
  mb: 3
};

export const textFieldStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 'var(--border-radius-large)',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-glow)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-glow)'
    }
  }
};

export const getButtonStyles = (isMobile: boolean): SxProps<Theme> => ({
  py: isMobile ? 2 : 1.5,
  borderRadius: 'var(--border-radius-large)',
  background: 'var(--gradient-magic)',
  boxShadow: 'var(--shadow-medium)',
  fontSize: isMobile ? '1.1rem' : '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-glow)',
    background: 'var(--gradient-sunset)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  '&:disabled': {
    background: 'var(--color-disabled)',
    transform: 'none',
    boxShadow: 'none'
  }
});
