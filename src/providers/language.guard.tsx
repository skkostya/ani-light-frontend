import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';

import { Languages, ROUTES, SUPPORTED_LANGUAGES } from '@/shared/constants';

const LanguageGuard: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const supportedLngs = useMemo(
    () => i18n.options.supportedLngs || SUPPORTED_LANGUAGES,
    [i18n.options.supportedLngs]
  );

  useLayoutEffect(() => {
    if (lang && !supportedLngs.includes(lang)) {
      let newPath = location.pathname.replace(
        new RegExp(`/${lang}`),
        `/${Languages.ru}`
      );

      if (newPath.match(/^\/\w{2}\/?$/)) {
        newPath += `/${ROUTES.catalog}`;
      }
      newPath += location.search;

      window.location.href = newPath;
    } else if (location.pathname.match(/(^\/\w{2}\/?$)|(^\/$)/)) {
      // Если нет языка в URL, используем сохраненный язык или русский по умолчанию
      const savedLang = localStorage.getItem('i18nextLng');
      const defaultLang =
        savedLang && supportedLngs.includes(savedLang)
          ? savedLang
          : Languages.ru;

      window.location.href = `/${defaultLang}/${ROUTES.catalog}`;
    } else if (lang && lang !== i18n.language) {
      // Сохраняем язык в localStorage при изменении
      localStorage.setItem('i18nextLng', lang);
      i18n.changeLanguage(lang);
    }
  }, [location, lang, i18n, supportedLngs, navigate]);

  // Настройки языка документа для SEO
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return children;
};

export { LanguageGuard };
