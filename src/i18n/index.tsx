import React, { createContext, useContext, useMemo, useState } from 'react';

export type Locale = 'es' | 'en';

export type Translations = Record<string, string>;

const es: Translations = require('./locales/es.json');
const en: Translations = require('./locales/en.json');

const resources: Record<Locale, Translations> = {
  es,
  en,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('es');

  const t = (key: string, fallback = '') => {
    const val = resources[locale]?.[key];
    if (val) return val;
    // fallback to es then en or provided fallback
    return resources['es'][key] || resources['en'][key] || fallback || key;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return { t: ctx.t, locale: ctx.locale, setLocale: ctx.setLocale };
};

