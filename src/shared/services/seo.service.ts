import { Languages, SITE_URL } from '@/shared/constants';

/**
 * Генерирует абсолютный URL для страницы
 * @param path - относительный путь (например, '/ru/anime')
 * @returns Абсолютный URL
 */
export const getAbsoluteUrl = (path: string): string => {
  // Убираем ведущий слэш, если есть
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * Генерирует канонический URL для страницы
 * @param lang - язык страницы
 * @param path - относительный путь без языка
 * @returns Канонический URL
 */
export const getCanonicalUrl = (lang: string, path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return getAbsoluteUrl(`/${lang}/${cleanPath}`);
};

/**
 * Генерирует альтернативные языковые URL для hreflang
 * @param path - относительный путь без языка
 * @returns Объект с URL для каждого языка
 */
export const getAlternateUrls = (path: string): Record<string, string> => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return {
    [Languages.ru]: getAbsoluteUrl(`/${Languages.ru}/${cleanPath}`),
    [Languages.en]: getAbsoluteUrl(`/${Languages.en}/${cleanPath}`)
  };
};

/**
 * Генерирует URL изображения для Open Graph
 * @param imagePath - путь к изображению (относительный или абсолютный)
 * @returns Абсолютный URL изображения
 */
export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * Обрезает описание до нужной длины для мета-тегов
 * @param description - исходное описание
 * @param maxLength - максимальная длина (по умолчанию 160)
 * @returns Обрезанное описание
 */
export const truncateDescription = (
  description: string,
  maxLength = 160
): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return `${description.slice(0, maxLength - 3)}...`;
};
