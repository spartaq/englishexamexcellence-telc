import React, { useState } from 'react';
import { LogOut, ArrowRight, Home, GraduationCap, BookOpen, Zap, Menu, X } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGoHome = () => {
    navigate('/');
    setMenuOpen(false);
  };

  const handleNavClick = (callback) => {
    if (callback) callback();
    setMenuOpen(false);
  };

  return (
    <>
      {/* HEADER - normal top navbar */}
      {showHeader && (
        <header className="header">
            
          <div className="header-left">
            <div className="lp-logo">
                <GraduationCap size={24} />
                <span className="lp-logo-wordmark">{t('nav.site-title')}</span>
            </div>

            
          </div>

          <div className="header-center">
            {headerCenterContent}
          </div>
          
           <div className="header-right">
             <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <nav className={`navbar ${menuOpen ? 'navbar-open' : ''}`}>
              <button 
                onClick={handleGoHome}
                className="nav-item"
              >
                <Home size={18} /> Home
              </button>

              {/* Exam Levels */}
              <div className="nav-section-label">{t('hub.exams')}</div>
              <button
                onClick={() => handleNavClick(() => onNavigateToLevel?.('b1'))}
                className="nav-item nav-item-level"
              >
                <GraduationCap size={18} /> TELC B1
              </button>
              <button
                onClick={() => handleNavClick(() => onNavigateToLevel?.('b2'))}
                className="nav-item nav-item-level"
              >
                <GraduationCap size={18} /> TELC B2
              </button>
              <button
                onClick={() => handleNavClick(() => onNavigateToLevel?.('c1'))}
                className="nav-item nav-item-level"
              >
                <GraduationCap size={18} /> TELC C1
              </button>

              {/* Skill Hubs */}
              <div className="nav-section-label">{t('hub.skills')}</div>
              <button
                onClick={() => handleNavClick(onNavigateToVocabHub)}
                className="nav-item"
              >
                <BookOpen size={18} /> Vocab Hub
              </button>
              <button
                onClick={() => handleNavClick(onNavigateToDrillsHub)}
                className="nav-item"
              >
                <Zap size={18} /> Drills Hub
              </button>

              <button 
                 className="nav-item nav-item-exit" 
                 onClick={handleGoHome}
              >
                <LogOut size={18} /> {t('common.close') || 'Close'}
              </button>
            </nav>

            {view === 'lesson' && (
              <button 
                onClick={() => { if (onNavigateBack) onNavigateBack(); }} 
                className="exit-btn"
              >
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close') || 'Close'}
              </button>
            )}
            {view === 'results' && (
              <button onClick={() => { if (onNavigateBack) onNavigateBack(); }} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close') || 'Close'}
              </button>
            )}
            {view === 'skillTests' && (
              <button onClick={() => { if (onNavigateBack) onNavigateBack(); }} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close') || 'Close'}
              </button>
            )}
            {(view === 'drillsHub' || view === 'selection') && (
              <button onClick={() => { if (onNavigateBack) onNavigateBack(); }} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> {t('common.close') || 'Close'}
              </button>
            )}
           </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      {children}
    </>
  );
};

export default AppShell;