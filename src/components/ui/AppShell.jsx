import React, { useState } from 'react';
import { LogOut, ArrowRight, Home, Menu, X, GraduationCap, BookOpen, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import XPBadge from '../gamified/XPBadge';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';
import './AppShell.css';

/**
 * AppShell Component
 * 
 * Layout wrapper that holds the Sidebar and Header.
 * Separates the UI frame from the Page Content.
 */
const AppShell = ({
  children,
  view, 
  onSelectPath,
  activeTest,
  showSidebar,
  showHeader,
  onNavigateBack,
  onNavigateToView,
  headerCenterContent,
  setActiveTest,
   onNavigateToVocabHub,
   onNavigateToDrillsHub,
   onNavigateToLevel
}) => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useLanguage();

  // Close mobile nav on outside click
  const handleNavItemClick = (onClick) => {
    onClick?.();
    setMobileNavOpen(false);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* SIDEBAR NAVIGATION - Desktop only */}
      {showSidebar && (
        <aside className="invictus-sidebar">
          <div className="invictus-brand">
            <h2 className="invictus-brand-title">
              {t('nav.home')}
            </h2>
            <p className="invictus-brand-subtext">
              {activeTest ? activeTest.title.toUpperCase() : t('nav.telc.info')}
            </p>
          </div>
          <nav className="invictus-nav">
            <button 
              onClick={() => handleNavItemClick(handleGoHome)}
              className="invictus-nav-item"
            >
              <Home size={18} /> {t('nav.home')}
            </button>

            {/* Exam Levels */}
            <div className="nav-section-label">{t('hub.exams')}</div>
            <button
              onClick={() => handleNavItemClick(() => onNavigateToLevel?.('b1'))}
              className="invictus-nav-item invictus-nav-item-level"
            >
              <GraduationCap size={18} /> TELC B1
            </button>
            <button
              onClick={() => handleNavItemClick(() => onNavigateToLevel?.('b2'))}
              className="invictus-nav-item invictus-nav-item-level"
            >
              <GraduationCap size={18} /> TELC B2
            </button>
            <button
              onClick={() => handleNavItemClick(() => onNavigateToLevel?.('c1'))}
              className="invictus-nav-item invictus-nav-item-level"
            >
              <GraduationCap size={18} /> TELC C1
            </button>

            {/* Skill Hubs */}
            <div className="nav-section-label">{t('hub.skills')}</div>
            <button
              onClick={() => handleNavItemClick(onNavigateToVocabHub)}
              className="invictus-nav-item"
            >
              <BookOpen size={18} /> Vocab Hub
            </button>
            <button
              onClick={() => handleNavItemClick(onNavigateToDrillsHub)}
              className="invictus-nav-item"
            >
              <Zap size={18} /> Drills Hub
            </button>

            <button 
               className="invictus-nav-item invictus-nav-item-exit" 
               onClick={() => handleNavItemClick(handleGoHome)}
             >
              <LogOut size={18} /> {t('common.close')}
            </button>
          </nav>
          
        </aside>
      )}

      {/* HEADER - Full width, above sidebar and content */}
      {showHeader && (
        <header className="invictus-header">
          <div className="invictus-header-left">
            {/* Hamburger menu button - only visible on mobile */}
            <button
              className="mobile-menu-trigger"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {view === 'lesson' && (
              <button 
                onClick={() => { 
                  if (onNavigateBack) onNavigateBack();
                }} 
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

          <div className="invictus-header-center">
            {headerCenterContent}
          </div>

           <div className="invictus-header-right">
              <LanguageSwitcher />
            </div>
        </header>
      )}

      {/* MOBILE NAV OVERLAY */}
      <div className={`mobile-nav-overlay ${mobileNavOpen ? 'is-open' : ''}`} onClick={(e) => {
        if (!e.target.closest('.mobile-nav-panel')) {
          setMobileNavOpen(false);
        }
      }}>
        <nav className="mobile-nav-panel">
          <div className="mobile-nav-brand">
            <h2 className="invictus-brand-title">TELCHub</h2>
            <p className="invictus-brand-subtext">
              {activeTest ? activeTest.title.toUpperCase() : 'SELECT EXAM'}
            </p>
          </div>

          <button
            className="mobile-nav-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          <button
            onClick={() => handleNavItemClick(handleGoHome)}
            className="mobile-nav-item"
          >
            <Home size={18} /> TELCHub
          </button>

          {/* Exam Levels */}
          <div className="mobile-nav-section-label">Exam Levels</div>
          <button
            onClick={() => handleNavItemClick(() => onNavigateToLevel?.('b1'))}
            className="mobile-nav-item mobile-nav-item-level"
          >
            <GraduationCap size={18} /> TELC B1
          </button>
          <button
            onClick={() => handleNavItemClick(() => onNavigateToLevel?.('b2'))}
            className="mobile-nav-item mobile-nav-item-level"
          >
            <GraduationCap size={18} /> TELC B2
          </button>
          <button
            onClick={() => handleNavItemClick(() => onNavigateToLevel?.('c1'))}
            className="mobile-nav-item mobile-nav-item-level"
          >
            <GraduationCap size={18} /> TELC C1
          </button>

          {/* Skill Hubs */}
          <div className="mobile-nav-section-label">Skill Hubs</div>
          <button
            onClick={() => handleNavItemClick(onNavigateToVocabHub)}
            className="mobile-nav-item"
          >
            <BookOpen size={18} /> Vocab Hub
          </button>
          <button
            onClick={() => handleNavItemClick(onNavigateToDrillsHub)}
            className="mobile-nav-item"
          >
            <Zap size={18} /> Drills Hub
          </button>

          <button
            className="mobile-nav-item invictus-nav-item-exit"
            onClick={() => handleNavItemClick(handleGoHome)}
          >
            <LogOut size={18} /> Exit Lab
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      {children}
    </>
  );
};

export default AppShell;
