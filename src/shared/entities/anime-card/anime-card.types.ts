/**
 * Типы для компонента карточки аниме
 */

export interface Anime {
  id: string;
  title: string;
  alias: string;
  originalTitle?: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  isFavorite: boolean;
  isWantToWatch: boolean;
  onGoing: boolean;
  genres?: string[];
  themes?: string[];
  year?: number;
  rating?: number;
  seasons?: number;
  episodes?: number;
  movies?: number;
  dominantColor?: string;
}

export interface AnimeCardProps {
  anime: Anime;
  onToggleFavorite?: (animeId: string) => void;
  onToggleWantToWatch?: (animeId: string) => void;
  variant?: 'default' | 'compact';
}
