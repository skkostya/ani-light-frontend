import type { AnimeRelease } from './anime-release.types';
import type { UserAnime } from './user.types';

// Интерфейс для сущности Anime
export interface IAnime {
  id: string;
  external_id?: string;
  name: string;
  name_english: string;
  alias: string;
  image?: string;
  rating?: number;
  last_year?: number;
  first_year?: number;
  total_releases: number;
  total_episodes: number;
  total_duration?: string;
  total_duration_in_seconds: number;
  animeReleases: AnimeRelease[];
  userAnime?: UserAnime[];
  accent_colors?: {
    dominant: string;
    palette: string[];
  };
}

export interface IAnimeListResponse {
  data: IAnime[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAnimeDetails extends IAnime {
  animeReleases: AnimeRelease[];
}

// Интерфейс для запроса списка аниме
export interface IGetAnimeListParams {
  search?: string;
  debouncedSearch?: string;
  min_rating?: number;
  max_rating?: number;
  year_from?: number;
  year_to?: number;
  genre?: string;
  is_ongoing?: boolean;
  page?: number;
  limit?: number;
}
