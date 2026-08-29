import uzCommon from "./locales/uz/common.json";
import uzProfile from "./locales/uz/profile.json";
import uzDashboard from "./locales/uz/dashboard.json";

import enCommon from "./locales/en/common.json";
import enProfile from "./locales/en/profile.json";
import enDashboard from "./locales/en/dashboard.json";

import ruCommon from "./locales/ru/common.json";
import ruProfile from "./locales/ru/profile.json";
import ruDashboard from "./locales/ru/dashboard.json";

import qqCommon from "./locales/qq/common.json";
import qqProfile from "./locales/qq/profile.json";
import qqDashboard from "./locales/qq/dashboard.json";

import qqKirCommon from "./locales/qqKir/common.json";
import qqKirProfile from "./locales/qqKir/profile.json";
import qqKirDashboard from "./locales/qqKir/dashboard.json";

import uzKirCommon from "./locales/uzKir/common.json";
import uzKirProfile from "./locales/uzKir/profile.json";
import uzKirDashboard from "./locales/uzKir/dashboard.json";

export const resources = {
  uz: {
    common: uzCommon,
    profile: uzProfile,
    dashboard: uzDashboard,
  },

  en: {
    common: enCommon,
    profile: enProfile,
    dashboard: enDashboard,
  },

  ru: {
    common: ruCommon,
    profile: ruProfile,
    dashboard: ruDashboard,
  },

  qq: {
    common: qqCommon,
    profile: qqProfile,
    dashboard: qqDashboard,
  },

  qqKir: {
    common: qqKirCommon,
    profile: qqKirProfile,
    dashboard: qqKirDashboard,
  },

  uzKir: {
    common: uzKirCommon,
    profile: uzKirProfile,
    dashboard: uzKirDashboard,
  },
} as const;
