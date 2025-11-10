// Типы для User API
import type { AnimeRelease } from './anime-release.types';
import type { IAnime } from './anime.types';
import type { IPaginatedResponse } from './api.types';
import type { Episode } from './episode.types';

export interface User {
  id: string;
  email?: string;
  username: string;
  subscription_type: 'FREE' | 'PREMIUM' | 'VIP';
  auth_type: 'EMAIL' | 'TELEGRAM';
  telegram_id?: string;
  created_at: string;
  notifications_enabled: boolean;
  notifications_telegram_enabled: boolean;
  notifications_email_enabled: boolean;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateTelegramUserDto {
  temp_token: string;
}

export interface TelegramAuthWithInitDataDto {
  initData: string;
}

export interface UserResponse {
  user: User;
  message: string;
}

export interface ProfileResponse {
  authenticated: boolean;
  user?: User;
  message?: string;
  shouldHideAds: boolean;
}

// === ПОЛЬЗОВАТЕЛЬСКИЕ АНИМЕ ===

export interface CreateUserAnimeDto {
  anime_id: string;
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  rating?: number;
  progress: number;
  is_favorite: boolean;
  is_want_to_watch: boolean;
  notes?: string;
}

export interface UpdateUserAnimeDto {
  status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  rating?: number;
  progress?: number;
  is_favorite?: boolean;
  is_want_to_watch?: boolean;
  notes?: string;
}

export interface UserAnime {
  id: string;
  user_id: string;
  anime_id: string;
  rating?: number;
  is_favorite: boolean;
  want_to_watch: boolean;
  notifications_telegram: boolean;
  notifications_email: boolean;
  created_at: string;
  updated_at: string;
  anime: Omit<IAnime, 'userAnime'> & {
    animeReleases?: Omit<AnimeRelease, 'userAnime'>[];
  };
}

export type UserAnimeListResponse = IPaginatedResponse<UserAnime>;

export interface UserWatchingAnime extends UserAnime {
  lastWatchedEpisode: Episode & {
    animeRelease: AnimeRelease;
  };
}

// === ПОЛЬЗОВАТЕЛЬСКИЕ ЭПИЗОДЫ ===

export interface INextUserEpisode {
  anime_id: string;
  anime: Omit<IAnime, 'userAnime' | 'animeReleases'>;
  anime_release: AnimeRelease;
  next_episode: Episode;
}

export interface CreateUserEpisodeDto {
  episode_id: string;
  status: 'not_watched' | 'watching' | 'watched';
  progress_percentage?: number;
  watched_at?: string;
  notes?: string;
}

export interface UpdateUserEpisodeDto {
  status?: 'not_watched' | 'watching' | 'watched';
  progress_percentage?: number;
  watched_at?: string;
  notes?: string;
}

export interface MarkEpisodeWatchedDto {
  watched_until_end: boolean;
}

export interface UserEpisode {
  id: string;
  user_id: string;
  episode_id: string;
  status: 'not_watched' | 'watching' | 'watched';
  last_watched_at?: string;
  watched_until_end_at?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  episode: {
    id: string;
    anime_id: string;
    anime_release_id?: string;
    number: number;
    title: string;
    duration: number;
    video_url: string;
    preview_image: string;
    animeRelease: {
      id: string;
      alias: string;
      sort_order: number;
      title_ru: string;
      title_en: string;
      poster_url: string;
      anime: {
        alias: string;
      };
    };
  };
}

export type UserHistoryListResponse = IPaginatedResponse<UserEpisode>;

// === УВЕДОМЛЕНИЯ ===

export interface UpdateUserNotificationsDto {
  notifications_enabled?: boolean;
  notifications_telegram_enabled?: boolean;
  notifications_email_enabled?: boolean;
}

export interface UserNotifications {
  notifications_enabled: boolean;
  notifications_telegram_enabled: boolean;
  notifications_email_enabled: boolean;
}

// === РЕЙТИНГИ АНИМЕ ===

export interface CreateAnimeRatingDto {
  rating: number;
  comment?: string;
}

export interface UpdateAnimeRatingDto {
  rating?: number;
  comment?: string;
}

export interface AnimeRating {
  id: string;
  user_id: string;
  anime_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
  };
  anime: {
    id: string;
    title_ru: string;
    title_en: string;
    poster_url: string;
  };
}

export interface AnimeRatingResponse {
  average: number;
  count: number;
}
