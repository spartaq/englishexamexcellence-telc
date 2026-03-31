import React from 'react';
import { LayoutDashboard, LogOut, ArrowRight } from 'lucide-react';
import XPBadge from '../gamified/XPBadge';

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
          <div className="invictus-brand" style={{ marginBottom: '2rem' }}>
            <h2 className="invictus-brand-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--invictus-red)' }}>
              IELTSHub
            </h2>
            <p className="invictus-brand-subtext" style={{ fontSize: '0.7rem', opacity: 0.5 }}>
              {activeTest ? activeTest.title.toUpperCase() : 'SELECT EXAM'}
            </p>
          </div>
          <nav className="invictus-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
              className="invictus-nav-item" 
              onClick={() => onNavigateToView('landing')} 
              style={{ marginTop: 'auto', opacity: 0.5 }}
            >
              <LogOut size={18} /> Exit Lab
            </button>
          </nav>
          <div style={{ marginTop: '60vh' }}>
            <XPBadge mode="total" />
          </div>
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
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
              </button>
            )}
            {view === 'results' && (
              <button onClick={() => onNavigateBack()} className="exit-btn">
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
              </button>
            )}
            {view === 'skillTests' && (
              <button onClick={() => onNavigateBack()} className="exit-btn">
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
              </button>
            )}
            {(view === 'drillsHub' || view === 'selection') && (
              <button onClick={() => onNavigateBack()} className="exit-btn">
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
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
