import { ApiConnector } from './api.connector';
import type { IPaginationParams } from './types/api.types';
import type {
  AnimeRating,
  AnimeRatingResponse,
  CreateAnimeRatingDto,
  CreateTelegramUserDto,
  CreateUserAnimeDto,
  CreateUserDto,
  CreateUserEpisodeDto,
  INextUserEpisode,
  LoginDto,
  MarkEpisodeWatchedDto,
  ProfileResponse,
  TelegramAuthWithInitDataDto,
  UpdateAnimeRatingDto,
  UpdateUserAnimeDto,
  UpdateUserEpisodeDto,
  UpdateUserNotificationsDto,
  UserAnime,
  UserAnimeListResponse,
  UserEpisode,
  UserHistoryListResponse,
  UserNotifications,
  UserResponse,
  UserWatchingAnime
} from './types/user.types';

class UserApi extends ApiConnector {
  // === АУТЕНТИФИКАЦИЯ ===

  /**
   * Регистрация нового пользователя
   */
  register(data: CreateUserDto): Promise<UserResponse> {
    return this.call<CreateUserDto, UserResponse>({
      path: 'auth/register',
      method: 'post',
      body: data
    });
  }

  /**
   * Вход в систему
   */
  login(data: LoginDto): Promise<UserResponse> {
    return this.call<LoginDto, UserResponse>({
      path: 'auth/login',
      method: 'post',
      body: data
    });
  }

  /**
   * Авторизация через Telegram
   */
  telegramAuth(data: CreateTelegramUserDto): Promise<UserResponse> {
    return this.call<CreateTelegramUserDto, UserResponse>({
      path: 'telegram/auth/exchange',
      method: 'post',
      body: data
    });
  }

  telegramAuthWithInitData(
    data: TelegramAuthWithInitDataDto
  ): Promise<UserResponse> {
    return this.call<TelegramAuthWithInitDataDto, UserResponse>({
      path: 'telegram/auth/exchange',
      method: 'post',
      body: data
    });
  }

  /**
   * Получить профиль пользователя
   */
  getProfile(): Promise<ProfileResponse> {
    return this.call<never, ProfileResponse>({
      path: 'auth/profile',
      method: 'get'
    });
  }

  /**
   * Выход из системы
   */
  logout(): Promise<{ message: string }> {
    return this.call<never, { message: string }>({
      path: 'auth/logout',
      method: 'post'
    });
  }

  // === ПОЛЬЗОВАТЕЛЬСКИЕ АНИМЕ ===

  /**
   * Добавить аниме в список пользователя
   */
  addUserAnime(data: CreateUserAnimeDto): Promise<UserAnime> {
    return this.call<CreateUserAnimeDto, UserAnime>({
      path: 'user/anime',
      method: 'post',
      body: data
    });
  }

  /**
   * Получить список аниме в процессе просмотра
   */
  getUserActiveAnimeList(): Promise<UserWatchingAnime[]> {
    return this.call<never, UserWatchingAnime[]>({
      path: 'user/anime/currently-watching',
      method: 'get'
    });
  }

  /**
   * Получить список эпизодов на очереди просмотра
   */
  getUserNextEpisodes(): Promise<INextUserEpisode[]> {
    return this.call<never, INextUserEpisode[]>({
      path: 'user/anime/next-episodes',
      method: 'get'
    });
  }

  /**
   * Получить избранные аниме
   */
  getFavoriteAnime(params: IPaginationParams): Promise<UserAnimeListResponse> {
    return this.call<IPaginationParams, UserAnimeListResponse>({
      path: 'user/anime/favorites',
      method: 'get',
      params
    });
  }

  /**
   * Получить список "Хочу посмотреть"
   */
  getWantToWatchAnime(
    params: IPaginationParams
  ): Promise<UserAnimeListResponse> {
    return this.call<IPaginationParams, UserAnimeListResponse>({
      path: 'user/anime/want-to-watch',
      method: 'get',
      params
    });
  }

  /**
   * Получить информацию об аниме пользователя
   */
  getUserAnime(animeId: string): Promise<UserAnime> {
    return this.call<never, UserAnime>({
      path: `user/anime/${animeId}`,
      method: 'get'
    });
  }

  /**
   * Обновить настройки аниме пользователя
   */
  updateUserAnime(
    animeId: string,
    data: UpdateUserAnimeDto
  ): Promise<UserAnime> {
    return this.call<UpdateUserAnimeDto, UserAnime>({
      path: `user/anime/${animeId}`,
      method: 'patch',
      body: data
    });
  }

  /**
   * Переключить статус избранного
   */
  toggleFavoriteAnime(animeId: string): Promise<UserAnime> {
    return this.call<never, UserAnime>({
      path: `user/anime/${animeId}/toggle-favorite`,
      method: 'post'
    });
  }

  /**
   * Переключить статус "Хочу посмотреть"
   */
  toggleWantToWatchAnime(animeId: string): Promise<UserAnime> {
    return this.call<never, UserAnime>({
      path: `user/anime/${animeId}/toggle-want-to-watch`,
      method: 'post'
    });
  }

  /**
   * Удалить аниме из списка пользователя
   */
  removeUserActiveAnime(animeId: string): Promise<void> {
    return this.call<never, void>({
      path: `user/anime/${animeId}/stop-watching`,
      method: 'delete'
    });
  }

  // === ПОЛЬЗОВАТЕЛЬСКИЕ ЭПИЗОДЫ ===

  /**
   * Добавить эпизод в список пользователя
   */
  addUserEpisode(data: CreateUserEpisodeDto): Promise<UserEpisode> {
    return this.call<CreateUserEpisodeDto, UserEpisode>({
      path: 'user/episodes',
      method: 'post',
      body: data
    });
  }

  /**
   * Получить список эпизодов пользователя
   */
  getUserEpisodeList(): Promise<UserEpisode[]> {
    return this.call<never, UserEpisode[]>({
      path: 'user/episodes',
      method: 'get'
    });
  }

  /**
   * Получить последние просмотренные эпизоды
   */
  getRecentEpisodes(): Promise<UserEpisode[]> {
    return this.call<never, UserEpisode[]>({
      path: 'user/episodes/recent',
      method: 'get'
    });
  }

  /**
   * Получить информацию об эпизоде пользователя
   */
  getUserEpisode(episodeId: string): Promise<UserEpisode> {
    return this.call<never, UserEpisode>({
      path: `user/episodes/${episodeId}`,
      method: 'get'
    });
  }

  /**
   * Получить историю просмотра
   */
  getUserEpisodesHistory(
    params: IPaginationParams
  ): Promise<UserHistoryListResponse> {
    return this.call<IPaginationParams, UserHistoryListResponse>({
      path: 'user/episodes/history',
      method: 'get',
      params
    });
  }

  /**
   * Обновить настройки эпизода пользователя
   */
  updateUserEpisode(
    episodeId: string,
    data: UpdateUserEpisodeDto
  ): Promise<UserEpisode> {
    return this.call<UpdateUserEpisodeDto, UserEpisode>({
      path: `user/episodes/${episodeId}`,
      method: 'patch',
      body: data
    });
  }

  /**
   * Отметить эпизод как просмотренный
   */
  markEpisodeWatched(
    episodeId: string,
    data: MarkEpisodeWatchedDto
  ): Promise<UserEpisode> {
    return this.call<MarkEpisodeWatchedDto, UserEpisode>({
      path: `user/episodes/${episodeId}/mark-watched`,
      method: 'post',
      body: data
    });
  }

  /**
   * Отметить эпизод как "смотрю"
   */
  markEpisodeWatching(episodeId: string): Promise<UserEpisode> {
    return this.call<never, UserEpisode>({
      path: `user/episodes/${episodeId}/mark-watching`,
      method: 'post'
    });
  }

  /**
   * Удалить эпизод из списка пользователя
   */
  removeUserEpisode(episodeId: string): Promise<void> {
    return this.call<never, void>({
      path: `user/episodes/${episodeId}`,
      method: 'delete'
    });
  }

  // === УВЕДОМЛЕНИЯ ===

  /**
   * Получить настройки уведомлений
   */
  getNotifications(): Promise<UserNotifications> {
    return this.call<never, UserNotifications>({
      path: 'user/notifications',
      method: 'get'
    });
  }

  /**
   * Обновить настройки уведомлений
   */
  updateNotifications(
    data: UpdateUserNotificationsDto
  ): Promise<UserNotifications> {
    return this.call<UpdateUserNotificationsDto, UserNotifications>({
      path: 'user/notifications',
      method: 'patch',
      body: data
    });
  }

  // === РЕЙТИНГИ АНИМЕ ===

  /**
   * Создать оценку аниме
   */
  createAnimeRating(
    animeId: string,
    data: CreateAnimeRatingDto
  ): Promise<AnimeRating> {
    return this.call<CreateAnimeRatingDto, AnimeRating>({
      path: `anime/${animeId}/ratings`,
      method: 'post',
      body: data
    });
  }

  /**
   * Получить все оценки аниме
   */
  getAnimeRatings(animeId: string): Promise<AnimeRating[]> {
    return this.call<never, AnimeRating[]>({
      path: `anime/${animeId}/ratings`,
      method: 'get'
    });
  }

  /**
   * Получить среднюю оценку аниме
   */
  getAnimeAverageRating(animeId: string): Promise<AnimeRatingResponse> {
    return this.call<never, AnimeRatingResponse>({
      path: `anime/${animeId}/ratings/average`,
      method: 'get'
    });
  }

  /**
   * Получить мою оценку аниме
   */
  getMyAnimeRating(animeId: string): Promise<AnimeRating> {
    return this.call<never, AnimeRating>({
      path: `anime/${animeId}/ratings/my`,
      method: 'get'
    });
  }

  /**
   * Обновить мою оценку аниме
   */
  updateMyAnimeRating(
    animeId: string,
    data: UpdateAnimeRatingDto
  ): Promise<AnimeRating> {
    return this.call<UpdateAnimeRatingDto, AnimeRating>({
      path: `anime/${animeId}/ratings/my`,
      method: 'patch',
      body: data
    });
  }

  /**
   * Удалить мою оценку аниме
   */
  deleteMyAnimeRating(animeId: string): Promise<void> {
    return this.call<never, void>({
      path: `anime/${animeId}/ratings/my`,
      method: 'delete'
    });
  }
}

export const userApi = new UserApi();
