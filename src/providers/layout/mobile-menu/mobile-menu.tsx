import {
  Bookmark,
  Close,
  History,
  Home,
  Login,
  Logout,
  PlaylistAdd,
  PlaylistPlay
} from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { userApi } from '@/api/user.api';
import { ROUTES } from '@/shared/constants';
import { useAppNavigate } from '@/shared/hooks/useAppNavigate';
import { isNavigationItemActive } from '@/shared/services/helpers/navigate-helper';
import { LocalizedLink, ThemeToggle } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setUser } from '@/store/user.slice';

import {
  authButtonStyles,
  authButtonsStyles,
  closeButtonStyles,
  controlsStyles,
  drawerContentStyles,
  drawerStyles,
  headerStyles,
  listItemButtonStyles,
  listItemIconStyles,
  listItemTextStyles,
  listStyles,
  logoStyles
} from './mobile-menu.styles';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Компонент мобильного меню для навигации
 * @param open - Открыто ли меню
 * @param onClose - Обработчик закрытия меню
 */
const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const isLoggedIn = !!user;

  const menuItems = [
    {
      label: t('layout.nav_catalog'),
      path: ROUTES.catalog,
      icon: <Home />
    },
    {
      label: t('layout.nav_watchlist'),
      path: ROUTES.watchList,
      icon: <PlaylistPlay />
    },
    {
      label: t('layout.nav_wantlist'),
      path: ROUTES.wantList,
      icon: <PlaylistAdd />
    },
    {
      label: t('layout.nav_favorites'),
      path: ROUTES.favorites,
      icon: <Bookmark />
    },
    {
      label: t('layout.nav_history'),
      path: ROUTES.history,
      icon: <History />
    }
    // TODO Профиль не реализован
    // {
    //   label: t('layout.nav_profile'),
    //   path: ROUTES.profile,
    //   icon: <Settings />
    // }
  ];

  // Определяем активный пункт меню на основе текущего пути
  const isActiveItem = (path: string): boolean => {
    return isNavigationItemActive(location.pathname, path);
  };

  const handleLogin = () => {
    navigate(ROUTES.login);
    onClose();
  };

  const handleLogout = () => {
    dispatch(setUser(undefined));
    userApi.logout();
    onClose();
  };

  const drawerContent = (
    <Box sx={drawerContentStyles}>
      {/* Заголовок */}
      <Box sx={headerStyles}>
        <Typography variant="h6" sx={logoStyles}>
          {t('layout.logo')}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={closeButtonStyles}>
          <Close />
        </IconButton>
      </Box>

      {/* Навигация */}
      <List sx={listStyles}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <LocalizedLink
              to={item.path}
              style={{ display: 'block', width: '100%' }}
              onClick={onClose}
            >
              <ListItemButton
                sx={{
                  ...listItemButtonStyles,
                  ...(isActiveItem(item.path) && {
                    backgroundColor: 'var(--color-background-elevated)',
                    borderLeft: '4px solid var(--color-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--color-background-elevated)'
                    }
                  })
                }}
              >
                <ListItemIcon sx={listItemIconStyles}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      ...listItemTextStyles,
                      ...(isActiveItem(item.path) && {
                        fontWeight: 600,
                        color: 'primary.main'
                      })
                    }
                  }}
                />
              </ListItemButton>
            </LocalizedLink>
          </ListItem>
        ))}
      </List>

      {/* Кнопки авторизации */}
      <Box sx={authButtonsStyles}>
        {isLoggedIn ? (
          <Button
            startIcon={<Logout />}
            onClick={handleLogout}
            variant="outlined"
            fullWidth
            sx={authButtonStyles}
          >
            {t('layout.layout_button_logout')}
          </Button>
        ) : (
          <Button
            startIcon={<Login />}
            onClick={handleLogin}
            variant="contained"
            fullWidth
            sx={authButtonStyles}
          >
            {t('layout.layout_button_login')}
          </Button>
        )}
      </Box>

      {/* Управление */}
      <Box sx={controlsStyles}>
        <ThemeToggle size="small" showTooltip={false} />

        {/* TODO английский не поддерживается на сервере */}
        {/* <LanguageSwitcher size="small" showTooltip={false} /> */}
      </Box>
    </Box>
  );

  return (
    <Drawer anchor="left" open={open} onClose={onClose} sx={drawerStyles}>
      {drawerContent}
    </Drawer>
  );
};

export default MobileMenu;
