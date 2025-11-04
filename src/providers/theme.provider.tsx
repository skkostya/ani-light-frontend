import { type ReactNode, useEffect, useLayoutEffect } from 'react';
import Cookies from 'universal-cookie';

import { setTheme, toggleTheme } from '@/store/app.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

type ThemeMode = 'light' | 'dark';

interface ThemeProviderProps {
  children: ReactNode;
}

const cookies = new Cookies(null, { path: '/' });
const THEME_COOKIE_NAME = 'theme';

/**
 * Синхронная инициализация темы для предотвращения мигания
 * Приоритет: Cookie > localStorage > Системная тема
 */
const initializeTheme = (): ThemeMode => {
  // Сначала проверяем cookie
  const cookieTheme = cookies.get(THEME_COOKIE_NAME) as ThemeMode;
  if (cookieTheme && (cookieTheme === 'light' || cookieTheme === 'dark')) {
    document.documentElement.setAttribute('data-theme', cookieTheme);
    return cookieTheme;
  }

  // Затем проверяем localStorage (для обратной совместимости)
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    // Сохраняем в cookie с полными опциями
    cookies.set(THEME_COOKIE_NAME, savedTheme, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 год (в секундах)
      sameSite: 'lax'
    });
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme;
  }

  // Проверяем системную тему
  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme = prefersDark ? 'dark' : 'light';

  // Применяем системную тему сразу к DOM
  document.documentElement.setAttribute('data-theme', systemTheme);
  return systemTheme;
};

// Инициализируем тему сразу при загрузке модуля
const initialTheme = initializeTheme();

/**
 * Провайдер для управления темами приложения
 * Поддерживает светлую и темную тему с сохранением в cookie и localStorage
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.app.theme);

  // Синхронизируем Redux store с уже инициализированной темой
  useLayoutEffect(() => {
    dispatch(setTheme(initialTheme));
  }, [dispatch]);

  // Сохраняем тему в cookie и localStorage при изменении
  useEffect(() => {
    try {
      // Применяем тему к корневому элементу для CSS переменных
      document.documentElement.setAttribute('data-theme', mode);

      // Сохраняем в cookie с полными опциями
      cookies.set(THEME_COOKIE_NAME, mode, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 год (в секундах)
        sameSite: 'lax'
      });

      // Сохраняем в localStorage для обратной совместимости
      localStorage.setItem('theme', mode);
    } catch (error) {
      // Fallback: используем только localStorage в случае ошибки
      console.error('Ошибка при сохранении темы в cookie:', error);
      localStorage.setItem('theme', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Применяем системную тему только если пользователь не выбрал тему вручную
      const hasUserTheme =
        cookies.get(THEME_COOKIE_NAME) || localStorage.getItem('theme');
      if (!hasUserTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  return <>{children}</>;
};

/**
 * Хук для использования темы
 * @returns Объект с функциями управления темой
 */
export const useTheme = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.app.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetTheme = (newMode: ThemeMode) => {
    dispatch(setTheme(newMode));
  };

  const resetToSystemTheme = () => {
    // Удаляем пользовательский выбор темы из cookie и localStorage
    cookies.remove(THEME_COOKIE_NAME);
    localStorage.removeItem('theme');

    // Применяем системную тему
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';

    dispatch(setTheme(systemTheme));
    document.documentElement.setAttribute('data-theme', systemTheme);
  };

  return {
    mode,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    resetToSystemTheme
  };
};
