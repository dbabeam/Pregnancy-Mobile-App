import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ee from './locales/ee.json';
import en from './locales/en.json';
import ga from './locales/ga.json';
import tw from './locales/tw.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en', // default language
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      tw: { translation: tw },
      ee: { translation: ee },
      ga: { translation: ga },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;