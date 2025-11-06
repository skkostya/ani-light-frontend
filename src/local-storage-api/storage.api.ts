import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

interface IPlayerSettings {
  auto_skip?: boolean;
  auto_next?: boolean;
  quality?: string;
  speed?: number;
  volume?: number;
}

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 дней

class StorageApi {
  updateWatchingTime = (data: {
    seasonExternalId: number;
    episodeNumber: number;
    watchingTime: number;
  }) => {
    if (!data.seasonExternalId || !data.episodeNumber || !data.watchingTime)
      return;
    const watchingTime = cookies.get('watching_time') || '';
    const watchingTimeData = watchingTime
      ? (watchingTime.split('-') as string[])
      : [];
    const index = watchingTimeData.findIndex((time: string) => {
      const [savedSeasonExternalId, savedEpisodeNumber] = time
        .split('.')
        .map(Number);
      return (
        data.seasonExternalId === savedSeasonExternalId &&
        data.episodeNumber === savedEpisodeNumber
      );
    });
    if (index !== -1) {
      watchingTimeData[index] = [
        data.seasonExternalId,
        data.episodeNumber,
        data.watchingTime
      ].join('.');
    } else {
      watchingTimeData.push(
        [data.seasonExternalId, data.episodeNumber, data.watchingTime].join('.')
      );
    }
    if (watchingTimeData.length > 20) {
      watchingTimeData.shift();
    }
    cookies.set('watching_time', watchingTimeData.join('-'), {
      maxAge: COOKIE_MAX_AGE
    });
  };

  getWatchingTime = (seasonExternalId: number, episodeNumber: number) => {
    const watchingTime = cookies.get('watching_time') || '';
    const watchingTimeData = watchingTime.split('-') as string[];
    const time = watchingTimeData.find((time: string) => {
      const [savedSeasonExternalId, savedEpisodeNumber] = time
        .split('.')
        .map(Number);
      return (
        seasonExternalId === savedSeasonExternalId &&
        episodeNumber === savedEpisodeNumber
      );
    });
    return time ? Number(time.split('.')[2]) : 0;
  };

  removeWatchingTime = (seasonExternalId: number, episodeNumber: number) => {
    const watchingTime = cookies.get('watching_time') || '';
    const watchingTimeData = watchingTime.split('-') as string[];
    const newWatchingTimeData = watchingTimeData.filter((time: string) => {
      const [savedSeasonExternalId, savedEpisodeNumber] = time
        .split('.')
        .map(Number);
      return (
        seasonExternalId !== savedSeasonExternalId ||
        episodeNumber !== savedEpisodeNumber
      );
    });
    cookies.set('watching_time', newWatchingTimeData.join('-'), {
      maxAge: COOKIE_MAX_AGE
    });
  };

  updatePlayerSettings = (settings: IPlayerSettings) => {
    const savedSettings = this.getPlayerSettings();
    const newSettings = {
      ...savedSettings,
      ...settings
    };
    for (const [key, value] of Object.entries(newSettings)) {
      cookies.set(`player_settings.${key}`, value || '', {
        maxAge: COOKIE_MAX_AGE
      });
    }
  };

  getPlayerSettings = () => {
    const settings = {
      auto_skip: undefined,
      auto_next: undefined,
      quality: undefined,
      speed: undefined,
      volume: undefined
    };
    for (const key of Object.keys(settings)) {
      const cookieValue = cookies.get(`player_settings.${key}`);
      settings[key as keyof typeof settings] = cookieValue
        ? cookieValue === 'undefined'
          ? undefined
          : cookieValue
        : settings[key as keyof typeof settings];
    }
    return settings as IPlayerSettings;
  };
}

export const storageApi = new StorageApi();
