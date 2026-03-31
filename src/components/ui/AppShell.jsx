import React from 'react';
import { LayoutDashboard, LogOut, ArrowRight } from 'lucide-react';
import XPBadge from '../gamified/XPBadge';
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
  activeTest,
  showSidebar,
  showHeader,
  onNavigateBack,
  onNavigateToView,
  headerCenterContent,
  setActiveTest
}) => {
  return (
    <>
      {/* SIDEBAR NAVIGATION */}
      {showSidebar && (
        <aside className="invictus-sidebar">
          <div className="invictus-brand">
            <h2 className="invictus-brand-title">
              IELTSHub
            </h2>
            <p className="invictus-brand-subtext">
              {activeTest ? activeTest.title.toUpperCase() : 'SELECT EXAM'}
            </p>
          </div>
          <nav className="invictus-nav">
            <button 
              onClick={() => { 
                onNavigateToView('ieltsHub'); 
                if (setActiveTest) setActiveTest(null); 
              }} 
              className={`invictus-nav-item ${view === 'ieltsHub' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} /> IELTSHub
            </button>

            <button 
              className="invictus-nav-item invictus-nav-item-exit" 
              onClick={() => onNavigateToView('landing')}
            >
              <LogOut size={18} /> Exit Lab
            </button>
          </nav>
         
        </aside>
      )}

      {/* HEADER - Full width, above sidebar and content */}
      {showHeader && (
        <header className="invictus-header">
          <div className="invictus-header-left">
            {view === 'lesson' && (
              <button 
                onClick={() => { 
                  if (onNavigateBack) onNavigateBack();
                }} 
                className="exit-btn"
              >
                <ArrowRight size={14} className="exit-btn-icon" /> Back
              </button>
            )}
            {view === 'results' && (
              <button onClick={() => onNavigateBack()} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> Back
              </button>
            )}
            {view === 'skillTests' && (
              <button onClick={() => onNavigateBack()} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> Back
              </button>
            )}
            {(view === 'drillsHub' || view === 'selection') && (
              <button onClick={() => onNavigateBack()} className="exit-btn">
                <ArrowRight size={14} className="exit-btn-icon" /> Back
              </button>
            )}
          </div>

          <div className="invictus-header-center">
            {headerCenterContent}
          </div>

          <div className="invictus-header-right">
            {view === 'lesson' && <XPBadge mode="time" />}
          </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      {children}
    </>
  );
};

export default AppShell;
