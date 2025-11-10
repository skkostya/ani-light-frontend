import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { userApi } from '@/api/user.api';
import { ROUTES } from '@/shared/constants';
import { toast } from '@/shared/entities';
import { useAppNavigate } from '@/shared/hooks/useAppNavigate';
import { MainLoader } from '@/shared/ui';

interface TelegramWebApp {
  initData: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const TelegramAuth: React.FC = () => {
  const { navigate } = useAppNavigate();
  const [searchParams] = useSearchParams();

  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    const temporaryToken = searchParams.get('temp_token');
    const tgInitData = window.Telegram?.WebApp?.initData;

    if (timeout.current === undefined) {
      timeout.current = setTimeout(() => {
        navigate(ROUTES.catalog);
      }, 5000);
    }

    if (!temporaryToken && !tgInitData) return;

    (async () => {
      clearTimeout(timeout.current);
      timeout.current = undefined;
      try {
        if (tgInitData) {
          await userApi.telegramAuthWithInitData({ initData: tgInitData });
        } else if (temporaryToken) {
          await userApi.telegramAuth({ temp_token: temporaryToken });
        }
      } catch {
        toast.error(
          'Ошибка авторизации через Телеграм. Пожалуйста, попробуйте еще раз'
        );
      }
      navigate(ROUTES.catalog);
    })();
  }, [searchParams]);

  return <MainLoader fullScreen />;
};

export default TelegramAuth;
