import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';

const STORAGE_KEY = 'fintracker_locale';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useTranslation();

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as 'es' | 'en' | null;
    if (saved && saved !== locale) {
      setLocale(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as 'es' | 'en';
    setLocale(newLocale);
    try {
      window.localStorage.setItem(STORAGE_KEY, newLocale);
    } catch (err) {
      // ignore storage errors
    }
  };

  return (
    <select aria-label="Language" value={locale} onChange={handleChange}>
      <option value="es">Español</option>
      <option value="en">English</option>
    </select>
  );
};

export default LanguageSwitcher;

