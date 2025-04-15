import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-react-native-language-detector';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import fr from '../locales/fr.json';

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['asyncStorage', 'device'],
      caches: ['asyncStorage'],
      asyncStorage: AsyncStorage,
    },
  });

export default i18n;
