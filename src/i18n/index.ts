import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./resources";

const savedLanguage = localStorage.getItem("language") || "uz";

i18n.use(initReactI18next).init({
  resources,

  lng: savedLanguage,

  fallbackLng: "uz",

  defaultNS: "common",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
