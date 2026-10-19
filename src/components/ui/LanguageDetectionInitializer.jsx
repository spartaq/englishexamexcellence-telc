import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageDetectionInitializer = () => {
  const { language, changeLanguage } = useLanguage();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    // Respect an explicit user preference saved in localStorage — don't
    // override it based on the current URL path.
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setHasInitialized(true);
      return;
    }

    // No saved preference — fall back to path-based detection (/hu/ → Hungarian).
    const pathLang =
      typeof window !== 'undefined' && window.location.pathname.startsWith('/hu/')
        ? 'hu'
        : 'en';

    if (language !== pathLang) {
      changeLanguage(pathLang);
    }

    setHasInitialized(true);
  }, [hasInitialized, language, changeLanguage]);

  return null;
};

export default LanguageDetectionInitializer;
