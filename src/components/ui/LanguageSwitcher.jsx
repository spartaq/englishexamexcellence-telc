import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, changeLanguage, isLoading } = useLanguage();
  
  if (isLoading) {
    return <div className="language-switcher loading">Loading...</div>;
  }
  
  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={`lang-btn ${language === 'hu' ? 'active' : ''}`}
        onClick={() => changeLanguage('hu')}
      >
        HU
      </button>
    </div>
  );
};

export default LanguageSwitcher;