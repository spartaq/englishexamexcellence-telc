import React, { useState } from 'react';
import { LogOut, ArrowRight, Home, Menu, X, GraduationCap, BookOpen, Zap } from 'lucide-react';
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
  onSelectPath,
  activeTest,
  showSidebar,
  showHeader,
  onNavigateBack,
  onNavigateToView,
  headerCenterContent,
  setActiveTest,
  onNavigateToMyWords,
  onNavigateToVocabHub,
  onNavigateToDrillsHub,
  onNavigateToLevel
}) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav on outside click
  const handleNavItemClick = (onClick) => {
    onClick?.();
    setMobileNavOpen(false);
  };

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
      {/* SIDEBAR NAVIGATION - Desktop only */}
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
              onClick={() => handleNavItemClick(handleGoHome)}
              className="invictus-nav-item"
            >
              <Home size={18} /> TELCHub
            </button>

            {/* Exam Levels */}
            <div className="nav-section-label">Exam Levels</div>
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
            <div className="nav-section-label">Skill Hubs</div>
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
              onClick={() => handleNavItemClick(handleSignOut)}
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
                      alt={`${user?.firstName ? user.firstName + "'s" : 'User'} profile photo`}
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
                   {/* Upgrade option - only show if not on Gold tier */}
                   {!user?.publicMetadata?.plan === 'gold' && (
                     <button 
                       className="profile-dropdown-item"
                       onClick={() => {
                         navigate('/pricing');
                         setShowProfileMenu(false);
                       }}
                     >
                       <span className="material-symbols-outlined">star</span>
                       Upgrade to Gold
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
            onClick={() => handleNavItemClick(handleSignOut)}
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
