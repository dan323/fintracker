import React, { useEffect } from 'react';
import { useTranslation, isSupportedLocale } from '../i18n';

const STORAGE_KEY = 'fintracker_locale';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useTranslation();

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== locale && isSupportedLocale(saved)) {
      setLocale(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as 'es' | 'en';
    if (isSupportedLocale(newLocale)) {
        setLocale(newLocale);
        try {
          window.localStorage.setItem(STORAGE_KEY, newLocale);
        } catch (err) {
          // ignore storage errors
        }
    } else {
        console.warn(`Unsupported locale selected: ${newLocale}`);
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

