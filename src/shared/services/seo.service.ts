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

/**
 * Генерирует keywords для мета-тега
 * @param customKeywords - пользовательские keywords (массив строк)
 * @param lang - язык страницы
 * @returns Строка с keywords через запятую
 */
export const generateKeywords = (
  customKeywords?: string[],
  lang: string = 'ru'
): string => {
  // Базовые keywords для аниме-сайта
  const baseKeywords = {
    ru: [
      'аниме',
      'смотреть аниме',
      'аниме онлайн',
      'аниме сериалы',
      'аниме фильмы',
      'AniLight',
      'каталог аниме',
      'просмотр аниме',
      'аниме бесплатно',
      'японская анимация',
      'аниме с русской озвучкой',
      'аниме с субтитрами',
      'популярное аниме',
      'новое аниме',
      'топ аниме'
    ],
    en: [
      'anime',
      'watch anime',
      'anime online',
      'anime series',
      'anime movies',
      'AniLight',
      'anime catalog',
      'stream anime',
      'free anime',
      'japanese animation',
      'anime with subtitles',
      'popular anime',
      'new anime',
      'top anime'
    ]
  };

  const defaultKeywords = lang === 'en' ? baseKeywords.en : baseKeywords.ru;

  // Объединяем пользовательские keywords с базовыми
  const allKeywords = customKeywords
    ? [...customKeywords, ...defaultKeywords]
    : defaultKeywords;

  // Убираем дубликаты и возвращаем строку
  return [...new Set(allKeywords)].join(', ');
};
