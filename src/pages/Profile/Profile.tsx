import {
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/shared/constants';
import { SEO } from '@/shared/ui';

import {
  containerStyles,
  contentStyles,
  errorStyles,
  loadingStyles,
  tabPanelStyles,
  tabStyles,
  tabsContainerStyles
} from './Profile.styles';
import {
  mockAchievements,
  mockProfileStats,
  mockRecentActivity,
  mockUserProfile
} from './mock-data';
import type { ProfileSettings as ProfileSettingsType } from './types';
import {
  ProfileAchievements,
  ProfileActivity,
  ProfileHeader,
  ProfileSettings,
  ProfileStats
} from './ui';

/**
 * Главная страница профиля пользователя
 */
const Profile: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Моковые данные (в реальном приложении будут загружаться с сервера)
  const profile = mockUserProfile;
  const stats = mockProfileStats;
  const achievements = mockAchievements;
  const activities = mockRecentActivity;
  const settings: ProfileSettingsType = {
    theme: 'light',
    language: 'ru',
    notifications: {
      email: true,
      push: true,
      newEpisodes: true,
      recommendations: false
    },
    privacy: {
      showStats: true,
      showActivity: true,
      showFavorites: true,
      showWatchList: false
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditAvatar = () => {
    // TODO: Реализовать редактирование аватара
  };

  const handleSaveSettings = () => {
    // TODO: Сохранить настройки на сервере
  };

  const handleExportData = () => {
    // TODO: Экспортировать данные пользователя
  };

  const handleDeleteAccount = () => {
    // TODO: Показать подтверждение и удалить аккаунт
  };

  if (isLoading) {
    return (
      <Box sx={containerStyles}>
        <Box sx={contentStyles}>
          <Box sx={loadingStyles}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              {t('profile_loading')}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={containerStyles}>
        <Box sx={contentStyles}>
          <Box sx={errorStyles}>
            <Typography variant="h6" color="error">
              {t('profile_error_title')}
            </Typography>
            <Typography variant="body2">
              {error || t('profile_error_description')}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <SEO
        title={t('profile_title', { defaultValue: 'Профиль' })}
        description={t('profile_description', {
          defaultValue: 'Профиль пользователя'
        })}
        path={`/${ROUTES.profile}`}
        noindex={true}
        nofollow={true}
      />
      <Box sx={containerStyles}>
        <Box sx={contentStyles}>
          {/* Заголовок профиля */}
          <ProfileHeader
            profile={profile}
            stats={stats}
            onEditAvatar={handleEditAvatar}
          />

          {/* Вкладки */}
          <Box sx={tabsContainerStyles}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ minHeight: 'auto' }}
            >
              <Tab
                label={
                  isMobile
                    ? t('profile_stats_title_short')
                    : t('profile_stats_title')
                }
                sx={tabStyles}
              />
              <Tab
                label={
                  isMobile
                    ? t('profile_achievements_title_short')
                    : t('profile_achievements_title')
                }
                sx={tabStyles}
              />
              <Tab
                label={
                  isMobile
                    ? t('profile_recent_activity_short')
                    : t('profile_recent_activity')
                }
                sx={tabStyles}
              />
              <Tab
                label={
                  isMobile
                    ? t('profile_settings_title_short')
                    : t('profile_settings_title')
                }
                sx={tabStyles}
              />
            </Tabs>
          </Box>

          {/* Контент вкладок */}
          <Box sx={tabPanelStyles}>
            {activeTab === 0 && <ProfileStats stats={stats} />}

            {activeTab === 1 && (
              <ProfileAchievements achievements={achievements} />
            )}

            {activeTab === 2 && <ProfileActivity activities={activities} />}

            {activeTab === 3 && (
              <ProfileSettings
                settings={settings}
                onSave={handleSaveSettings}
                onExportData={handleExportData}
                onDeleteAccount={handleDeleteAccount}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
