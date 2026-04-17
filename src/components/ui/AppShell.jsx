import React, { useState } from 'react';
import { LogOut, ArrowRight, Home } from 'lucide-react';
import { useUser, useSignIn, useClerk } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
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
  setActiveTest,
  onNavigateToMyWords
}) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
      window.location.href = '/';
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* SIDEBAR NAVIGATION */}
      {showSidebar && (
        <aside className="invictus-sidebar">
          <div className="invictus-brand">
            <h2 className="invictus-brand-title">
              TELCHub
            </h2>
            <p className="invictus-brand-subtext">
              {activeTest ? activeTest.title.toUpperCase() : 'SELECT EXAM'}
            </p>
          </div>
          <nav className="invictus-nav">
            <button 
              onClick={handleGoHome}
              className="invictus-nav-item"
            >
              <Home size={18} /> TELCHub
            </button>

            <button 
              className="invictus-nav-item invictus-nav-item-exit" 
              onClick={handleSignOut}
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
            
            {/* Custom Profile Dropdown */}
            <div className="profile-dropdown-container">
              <button 
                className="profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {isLoaded && user ? (
                  user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="Profile" 
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="profile-avatar-fallback">
                      {user.firstName?.[0] || user.username?.[0] || 'U'}
                    </div>
                  )
                ) : (
                  <div className="profile-avatar-fallback">?</div>
                )}
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  {onNavigateToMyWords && (
                    <button 
                      className="profile-dropdown-item"
                      onClick={() => {
                        onNavigateToMyWords();
                        setShowProfileMenu(false);
                      }}
                    >
                      <span className="material-symbols-outlined">book</span>
                      My Words
                    </button>
                  )}
                  <button 
                    className="profile-dropdown-item"
                    onClick={handleSignOut}
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      {children}
    </>
  );
};

export default AppShell;
