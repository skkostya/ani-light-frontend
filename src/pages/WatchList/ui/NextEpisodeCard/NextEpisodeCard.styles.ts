export const nextEpisodeCardStyles = {
  card: {
    position: 'relative',
    borderRadius: 'var(--border-radius-large)',
    overflow: 'hidden',
    backgroundColor: 'var(--color-background-elevated)',
    boxShadow: 'var(--shadow-medium)',
    border: '2px solid transparent',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    display: 'flex',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-large)',
      border: '2px solid var(--color-primary)',
      '& .play-button': {
        opacity: 1,
        transform: 'scale(1.1)'
      },
      '& .episode-overlay': {
        opacity: 1
      },
      '& .anime-image': {
        transform: 'scale(1.05)'
      }
    }
  },

  imageContainer: {
    position: 'relative',
    width: { xs: 120, sm: 130 },
    maxHeight: '100%',
    overflow: 'hidden',
    '& > div': {
      height: '100%'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
      zIndex: 1
    }
  },

  animeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
    className: 'anime-image'
  },

  episodeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 2,
    className: 'episode-overlay'
  },

  playButton: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'var(--gradient-magic)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-glow)',
    opacity: 0,
    transform: 'scale(0.8)',
    transition: 'all 0.3s ease-in-out',
    className: 'play-button',
    '&:hover': {
      transform: 'scale(1.2)',
      boxShadow: '0 0 16px rgba(233, 30, 99, 0.6)'
    }
  },

  content: {
    paddingBlock: { xs: 1, sm: 1.5 },
    paddingLeft: { xs: 2, sm: 2.5 },
    paddingRight: '50px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },

  animeTitle: {
    fontSize: { xs: '1rem', sm: '1.1rem' },
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: 1.3,
    mb: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  episodeNumber: {
    background: 'var(--gradient-ocean)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: 'var(--border-radius-small)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: 'var(--shadow-small)',
    alignSelf: 'flex-start'
  },

  deleteButton: {
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease-in-out',
    zIndex: 4,
    '&:hover': {
      backgroundColor: 'var(--color-error)',
      transform: 'scale(1.1)',
      boxShadow: '0 0 12px rgba(244, 67, 54, 0.4)'
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  },

  // Стили для Popover
  popover: {
    '& .MuiPopover-paper': {
      borderRadius: 'var(--border-radius-large)',
      backgroundColor: 'var(--color-background-elevated)',
      border: '2px solid var(--color-primary)',
      boxShadow: 'var(--shadow-glow)',
      overflow: 'hidden',
      minWidth: 260,
      maxWidth: 320
    }
  },

  popoverContent: {
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  },

  popoverTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    textAlign: 'center'
  },

  popoverDescription: {
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    lineHeight: 1.4
  },

  popoverActions: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center'
  },

  popoverCancelButton: {
    minWidth: 100,
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-medium)',
    backgroundColor: 'var(--color-background-paper)',
    color: 'var(--color-text-primary)',
    border: '2px solid var(--color-border)',
    fontWeight: 500,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: 'var(--color-background-hover)',
      borderColor: 'var(--color-primary)',
      transform: 'translateY(-1px)',
      boxShadow: 'var(--shadow-small)'
    }
  },

  popoverDeleteButton: {
    minWidth: 100,
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-medium)',
    background: 'var(--gradient-fire)',
    color: 'white',
    fontWeight: 600,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 0 16px rgba(244, 67, 54, 0.4)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  }
};
