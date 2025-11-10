import type React from 'react';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { Languages, SITE_URL } from '@/shared/constants';
import {
  generateKeywords,
  getAlternateUrls,
  getCanonicalUrl,
  getImageUrl,
  truncateDescription
} from '@/shared/services/seo.service';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  type?: 'website' | 'article' | 'video';
  structuredData?: object;
}

/**
 * Компонент для управления SEO мета-тегами страницы
 */
export const SEO: React.FC<SEOProps> = (props) => {
  const { lang } = useParams<{ lang: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = lang || i18n.language || Languages.ru;

  const seoData = useMemo(() => {
    const {
      title,
      description,
      image,
      path = '',
      keywords,
      noindex = false,
      nofollow = false,
      type = 'website',
      structuredData
    } = props;

    // Генерируем полный путь с языком
    const canonicalUrl = getCanonicalUrl(currentLang, path);
    const alternateUrls = getAlternateUrls(path);

    // Формируем title
    const pageTitle = title ? `${title}` : '';

    // Формируем description
    const metaDescription = description
      ? truncateDescription(description)
      : t('catalog_description', {
          defaultValue: 'Сервис для просмотра ваших любимых аниме'
        });

    // Формируем keywords
    const metaKeywords = generateKeywords(keywords, currentLang);

    // Формируем image URL
    const ogImage = image
      ? getImageUrl(image)
      : `${SITE_URL}/ani-light-icon.png`;

    // Формируем robots meta
    const robots = [];
    if (noindex) robots.push('noindex');
    if (nofollow) robots.push('nofollow');
    if (robots.length === 0) robots.push('index', 'follow');
    const robotsContent = robots.join(', ');

    return {
      title: pageTitle,
      description: metaDescription,
      keywords: metaKeywords,
      canonicalUrl,
      alternateUrls,
      ogImage,
      ogType: type,
      robotsContent,
      structuredData
    };
  }, [props, currentLang, t, i18n.language]);

  return (
    <Helmet>
      {/* Базовые мета-теги */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta name="language" content={currentLang} />
      <meta name="robots" content={seoData.robotsContent} />

      {/* Канонический URL */}
      <link rel="canonical" href={seoData.canonicalUrl} />

      {/* Альтернативные языковые версии */}
      {Object.entries(seoData.alternateUrls).map(([langCode, url]) => (
        <link key={langCode} rel="alternate" hrefLang={langCode} href={url} />
      ))}

      {/* Open Graph мета-теги */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.ogImage} />
      <meta property="og:image:alt" content={seoData.title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:type" content={seoData.ogType} />
      <meta property="og:site_name" content="AniLight" />
      <meta
        property="og:locale"
        content={currentLang === Languages.ru ? 'ru_RU' : 'en_US'}
      />

      {/* Альтернативные локали для Open Graph */}
      {Object.entries(seoData.alternateUrls).map(([langCode]) => (
        <meta
          key={`og:locale:alternate:${langCode}`}
          property="og:locale:alternate"
          content={langCode === Languages.ru ? 'ru_RU' : 'en_US'}
        />
      ))}

      {/* Twitter Card мета-теги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.ogImage} />
      <meta name="twitter:image:alt" content={seoData.title} />

      {/* Структурированные данные JSON-LD */}
      {seoData.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      )}
    </Helmet>
  );
};
