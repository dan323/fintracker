import React, { createContext, useContext, useMemo, useState } from 'react';

export type Locale = 'es' | 'en';

export type Translations = Record<string, string>;

import es from './locales/es.json';
import en from './locales/en.json';

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
  const getInitialLocale = (): Locale => {
    try {
      const saved = window.localStorage.getItem('fintracker_locale');
      if (isSupportedLocale(saved)) return saved;
    } catch { }
    return 'es';
  };
  const [locale, setLocale] = useState<Locale>(getInitialLocale());

  const t = (key: string, fallback = '') => {
    const val = resources[locale]?.[key];
    if (val) return val;
    // fallback to es then en or provided fallback
    return resources['es'][key] || resources['en'][key] || fallback || key;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const isSupportedLocale = (v: string | null) => v === 'es' || v === 'en';

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return { t: ctx.t, locale: ctx.locale, setLocale: ctx.setLocale };
};
