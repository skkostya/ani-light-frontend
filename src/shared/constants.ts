export const ROUTES = {
  login: 'login',
  register: 'register',

  catalog: 'anime',
  animeEpisodes: (alias = ':alias') => `anime/${alias}`,
  anime: (
    alias = ':alias',
    params?: { episodeNumber?: string; seasonNumber?: string }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.seasonNumber) searchParams.set('season', params.seasonNumber);
    if (params?.episodeNumber)
      searchParams.set('episode', params.episodeNumber);
    return `anime/${alias}/watch${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },

  watchList: 'watch-list',
  wantList: 'want-list',
  favorites: 'favorites',
  history: 'history',
  profile: 'profile'
};

export enum Languages {
  ru = 'ru',
  en = 'en'
}
export const SUPPORTED_LANGUAGES = [Languages.ru, Languages.en];

// SEO константы
export const SITE_URL = 'https://anilight.net';
