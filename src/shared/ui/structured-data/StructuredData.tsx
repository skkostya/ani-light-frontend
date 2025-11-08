import type React from 'react';

import { SITE_URL } from '@/shared/constants';
import { getAbsoluteUrl } from '@/shared/services/seo.service';

/**
 * Интерфейс для структурированных данных WebSite
 */
export interface WebSiteData {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

/**
 * Интерфейс для структурированных данных CollectionPage
 */
export interface CollectionPageData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
}

/**
 * Интерфейс для структурированных данных TVSeries
 */
export interface TVSeriesData {
  '@context': string;
  '@type': string;
  name: string;
  alternateName?: string;
  description: string;
  image?: string;
  genre?: string[];
  datePublished?: string;
  dateModified?: string;
  aggregateRating?: {
    '@type': string;
    ratingValue?: number;
    ratingCount?: number;
  };
}

/**
 * Интерфейс для структурированных данных VideoObject
 */
export interface VideoObjectData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  partOfSeries?: {
    '@type': string;
    name: string;
  };
}

/**
 * Интерфейс для структурированных данных BreadcrumbList
 */
export interface BreadcrumbListData {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Компонент для добавления структурированных данных JSON-LD
 */
interface StructuredDataProps {
  data:
    | WebSiteData
    | CollectionPageData
    | TVSeriesData
    | VideoObjectData
    | BreadcrumbListData;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script type="application/ld+json">{JSON.stringify(data, null, 0)}</script>
  );
};

/**
 * Утилита для создания структурированных данных WebSite
 */
export const createWebSiteData = (
  name: string,
  description: string,
  lang: string
): WebSiteData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: SITE_URL,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${lang}/anime?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

/**
 * Утилита для создания структурированных данных CollectionPage
 */
export const createCollectionPageData = (
  name: string,
  description: string,
  lang: string
): CollectionPageData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: getAbsoluteUrl(`/${lang}/anime`)
  };
};

/**
 * Утилита для создания структурированных данных TVSeries
 */
export const createTVSeriesData = (
  name: string,
  description: string,
  image?: string,
  alternateName?: string,
  genres?: string[],
  firstYear?: number,
  lastYear?: number
): TVSeriesData => {
  const data: TVSeriesData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name,
    description
  };

  if (image) {
    data.image = getAbsoluteUrl(image);
  }

  if (alternateName) {
    data.alternateName = alternateName;
  }

  if (genres && genres.length > 0) {
    data.genre = genres;
  }

  if (firstYear) {
    data.datePublished = `${firstYear}-01-01`;
  }

  if (lastYear) {
    data.dateModified = `${lastYear}-01-01`;
  }

  return data;
};

/**
 * Утилита для создания структурированных данных VideoObject
 */
export const createVideoObjectData = (
  name: string,
  description: string,
  thumbnailUrl?: string,
  uploadDate?: string,
  duration?: string,
  seriesName?: string
): VideoObjectData => {
  const data: VideoObjectData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description
  };

  if (thumbnailUrl) {
    data.thumbnailUrl = getAbsoluteUrl(thumbnailUrl);
  }

  if (uploadDate) {
    data.uploadDate = uploadDate;
  }

  if (duration) {
    data.duration = duration;
  }

  if (seriesName) {
    data.partOfSeries = {
      '@type': 'TVSeries',
      name: seriesName
    };
  }

  return data;
};

/**
 * Утилита для создания структурированных данных BreadcrumbList
 */
export const createBreadcrumbListData = (
  items: Array<{ name: string; url: string }>
): BreadcrumbListData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.url)
    }))
  };
};
