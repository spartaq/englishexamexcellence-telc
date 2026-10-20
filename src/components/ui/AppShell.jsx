import React from 'react';
import { LogOut, ArrowRight, Home, GraduationCap, BookOpen, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import XPBadge from '../gamified/XPBadge';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';
import './AppShell.css';

/**
 * AppShell Component
 * 
 * Layout wrapper with a normal top navbar (no sidebar).
 * Separates the UI frame from the Page Content.
 */
const AppShell = ({
  children,
  view,
  showHeader,
  onNavigateBack,
  headerCenterContent,
   onNavigateToVocabHub,
   onNavigateToDrillsHub,
   onNavigateToLevel
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* HEADER - normal top navbar */}
      {showHeader && (
        <header className="header">
          <div className="header-left">
            <nav className="navbar">
              <button 
                onClick={handleGoHome}
                className="nav-item"
              >
                <Home size={18} /> {t('nav.home')}
              </button>

              {/* Exam Levels */}
              <div className="nav-section-label">{t('hub.exams')}</div>
              <button
                onClick={() => onNavigateToLevel?.('b1')}
                className="nav-item nav-item-level"
              >
                <GraduationCap size={18} /> TELC B1
              </button>
              <button
                onClick={() => onNavigateToLevel?.('b2')}
                className="nav-item nav-item-level"
              >
                <GraduationCap size={18} /> TELC B2
              </button>
              <button
                onClick={() => onNavigateToLevel?.('c1')}
                className="nav-item nav-item-level"
              >
                <GraduationCap size={18} /> TELC C1
              </button>

              {/* Skill Hubs */}
              <div className="nav-section-label">{t('hub.skills')}</div>
              <button
                onClick={onNavigateToVocabHub}
                className="nav-item"
              >
                <BookOpen size={18} /> Vocab Hub
              </button>
              <button
                onClick={onNavigateToDrillsHub}
                className="nav-item"
              >
                <Zap size={18} /> Drills Hub
              </button>

              <button 
                 className="nav-item nav-item-exit" 
                 onClick={handleGoHome}
              >
                <LogOut size={18} /> {t('common.close')}
              </button>
            </nav>

            {view === 'lesson' && (
              <button 
                onClick={() => { if (onNavigateBack) onNavigateBack(); }} 
                className="exit-btn"
              >
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close')}
              </button>
            )}
            {view === 'results' && (
              <button onClick={() => { if (onNavigateBack) onNavigateBack(); }} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close')}
              </button>
            )}
            {view === 'skillTests' && (
              <button onClick={() => { if (onNavigateBack) onNavigateBack(); }} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close')}
              </button>
            )}
            {(view === 'drillsHub' || view === 'selection') && (
              <button onClick={() => { if (onNavigateBack) onNavigateBack(); }} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close')}
              </button>
            )}
          </div>

          <div className="header-center">
            {headerCenterContent}
          </div>

           <div className="header-right">
             <LanguageSwitcher />
           </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      {children}
    </>
  );
};

export default AppShell;

