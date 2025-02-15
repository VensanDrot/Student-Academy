import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./locales/ru.json";
import en from "./locales/en.json";
import Cookies from "js-cookie";

const language = Cookies.get("language");

const resources = {
  ru: {
    translation: ru,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(LanguageDetector)
  .use(detector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: language || "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: resources,
    maxRetries: 3,
  });

export default i18n;
