import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { userApi } from '@/api/user.api';
import { getClientToken } from '@/shared/services/user-hash';

const useUserVideo = () => {
  const token = getClientToken();
  const [searchParams] = useSearchParams();
  const episodeNumber = searchParams.get('episode');

  const markedAsWatching = useRef(false);
  const markedAsWatched = useRef(false);

  const handleStartWatching = async (episodeId: string) => {
    if (!token || markedAsWatching.current) return;
    try {
      await userApi.markEpisodeWatching(episodeId);
    } catch (error) {
      console.error(error);
    }
    markedAsWatching.current = true;
  };

  const handleMarkEpisodeWatched = async (episodeId: string) => {
    if (!token || markedAsWatched.current) return;
    try {
      await userApi.markEpisodeWatched(episodeId, {
        watched_until_end: true
      });
    } catch (error) {
      console.error(error);
    }
    markedAsWatched.current = true;
  };

  useEffect(() => {
    if (!episodeNumber) return;
    markedAsWatching.current = false;
    markedAsWatched.current = false;
  }, [episodeNumber]);

  return {
    markedAsWatching,
    markedAsWatched,
    handleStartWatching,
    handleMarkEpisodeWatched
  };
};

export default useUserVideo;
