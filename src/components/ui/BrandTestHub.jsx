import React from 'react';
import { useUser } from '@clerk/react';
import { 
  Zap, Clock, BookOpen, Info, List, Shuffle, 
  Timer, Library, GraduationCap, Lock, Search, 
  Mic, Headset, PenTool, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { telcMocks } from '../../data/TELC/mocks';

import './BrandTestHub.css';

const BrandTestHub = ({ 
    activeTest, 
    onSelectPath, 
    onSelectModule, 
    onStartSkill,  // NEW: Handler for direct skill start
    EXTRA_TOOLS,
    onOpenPaywall,
    level = null  // 'b1', 'b2', 'c1', or null for all
  }) => {

  const { user, isSignedIn } = useUser();

  // 1. Determine User Tier
  let userTier = 'bronze';
  if (isSignedIn) {
    userTier = user?.publicMetadata?.plan === 'gold' ? 'gold' : 'silver';
  }

  // 2. Access Checker logic
  const canAccess = (mockTier) => {
    if (mockTier === 'bronze') return true;
    if (mockTier === 'silver' && (userTier === 'silver' || userTier === 'gold')) return true;
    if (mockTier === 'gold' && userTier === 'gold') return true;
    return false;
  };

  // Filter mocks by level if specified
  const filteredMocks = level 
    ? Object.values(telcMocks).filter(m => m.level === level)
    : Object.values(telcMocks);

  // Level-specific title and badge
  const levelTitle = level ? `TELC ${level.toUpperCase()}` : 'TELC';
  const levelBadge = level ? `TELC ${level.toUpperCase()}` : 'TELC';
  const singleExercisePath = level ? `telc-${level}-single-exercise` : 'telc-b2-single-exercise';

  return (
    <div className="hub-container">

      {/* --- 1. WELCOME HERO SECTION --- */}
      <header className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">{levelBadge}</span>
          <h1 className="hero-title">{activeTest?.title || `${levelTitle} Hub`}</h1>
          <p className="hero-subtitle">
            Stop practicing. Start training. Build skills daily with Atoms, 
            or test your stamina with our full mock exam archive.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => onSelectPath(singleExercisePath)}>
              Quick Start
            </button>
            <Link to="/telc-info" className="btn-outline-white" style={{ textDecoration: 'none' }}>
              Exam Info
            </Link>
          </div>
        </div>

        
      </header>

      {/* --- 2. QUICK START SECTION (ATOMS) --- */}
      <div className="section-header">
        <h2 className="section-title">Practice Tests</h2>
      </div>

      <div className="quick-start-grid">
<div className="quick-card">
        <div className="archive-controls">
          <div className="search-input-wrapper">
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '18px', color: '#94a3b8' }} />
            <input type="text" placeholder="Search mocks by number or title..." />
          </div>
          <div className="filter-tabs">
            <button className="filter-tab active">All Mocks</button>
            <button className="filter-tab">Bronze</button>
            <button className="filter-tab">Gold</button>
          </div>
        </div>

        <div className="exam-list">
          {filteredMocks.map(mock => {
              const hasAccess = canAccess(mock.tier);
              
              return (
                <div key={mock.id} className={`exam-list-item ${!hasAccess ? 'locked-item' : ''}`}>
                    <div className="exam-info">
                    <div className="exam-title">
                        {mock.title} 
                        {!hasAccess && <Lock size={14} style={{ marginLeft: '8px', color: '#94a3b8' }} />}
                    </div>
                    <div className="exam-meta">
                  <span className={`tier-text ${mock.tier}`}>{mock.tier.toUpperCase()} TIER</span>
                    </div>
                  </div>
                  
                  <button
                    className={hasAccess ? "btn-start-exam" : "btn-hub"}
                    onClick={() => {
                      console.log('[BrandTestHub] Start Mock button clicked', { mockId: mock.id, mockType: mock.type, hasAccess });
                      if (hasAccess) {
                        const path = mock.id;
                        console.log('[BrandTestHub] Calling onSelectPath with path:', path);
                        onSelectPath(path);
                      } else {
                        onOpenPaywall();
                      }
                    }}
                  >
                    {hasAccess ? "Start Mock" : "Unlock Gold"}
                  </button>
                </div>
              );
          })}
        </div>
      </div>


       {/* <div className="quick-card" onClick={() => onSelectPath(miniTestPath)}>
          <div className="quick-icon-box"><Shuffle size={24} /></div>
          <h3 className="exam-title">{level ? `${level.toUpperCase()} Random` : 'Random Mix'}</h3>
          <p className="exam-meta">15 MIN • ALL SKILLS</p>
          <p className="exam-description">A randomized mix of questions across all four skills to keep you sharp and adaptable.</p>
        </div> */}

        {/* NEW: Inline Skill Grid - REVERT by uncommenting below and removing this block */}
        <div className="quick-card">
          <h3 className="exam-title">Practice Atoms</h3>
          <p className="exam-meta">CHOOSE YOUR ATOM</p>
          
          <div className="inline-skill-grid">
            <button 
              className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
              onClick={() => onStartSkill && onStartSkill('reading', level)}
              disabled={!onStartSkill}
              aria-disabled={!onStartSkill}
            >
              <BookOpen size={20} />
              <span>Reading</span>
            </button>
            <button 
              className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
              onClick={() => onStartSkill && onStartSkill('language-elements', level)}
              disabled={!onStartSkill}
              aria-disabled={!onStartSkill}
            >
              <FileText size={20} />
              <span>Lang. Elements</span>
            </button>
            <button 
              className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
              onClick={() => onStartSkill && onStartSkill('listening', level)}
              disabled={!onStartSkill}
              aria-disabled={!onStartSkill}
            >
              <Headset size={20} />
              <span>Listening</span>
            </button>
            <button 
              className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
              onClick={() => onStartSkill && onStartSkill('speaking', level)}
              disabled={!onStartSkill}
              aria-disabled={!onStartSkill}
            >
              <Mic size={20} />
              <span>Speaking</span>
            </button>
            <button 
              className={`inline-skill-btn ${!onStartSkill ? 'disabled' : ''}`}
              onClick={() => onStartSkill && onStartSkill('writing', level)}
              disabled={!onStartSkill}
              aria-disabled={!onStartSkill}
            >
              <PenTool size={20} />
              <span>Writing</span>
            </button>
          </div>
          
          <p className="exam-description">Target individual skills with focused practice sessions tailored to your weak areas.</p>
        </div>
        
        {/* OLD: Skill Tests View - REVERT by uncommenting this and removing the block above */}
        {/* 
        <div className="quick-card" onClick={() => onSelectPath('skill-tests')}>
          <div className="quick-icon-box"><List size={24} /></div>
          <h3 className="exam-title">Specific Skills</h3>
          <p className="exam-meta">CHOOSE YOUR ATOM</p>
          <p className="exam-description">Target individual skills with focused practice sessions tailored to your weak areas.</p>
        </div>
        */}
      </div>

      {/* --- 3. THE EXAM ARCHIVE (MOCK LIBRARY) --- 
      <div className="section-header">
        <h2 className="section-title">Full Mock Exam Archive</h2>
      </div>*/}

      

      {/* --- 4. PRECISION TRAINING (EXTRA TOOLS) --- */}
      <div className="section-header">
        <h2 className="section-title">Practice Exercises</h2>
      </div>

      <div className="precision-grid">
        {EXTRA_TOOLS && EXTRA_TOOLS.map(tool => {
          const hubKey = tool && typeof tool.hubKey === 'string' && tool.hubKey.trim() ? tool.hubKey : null;
          const validHex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(tool?.color);
          const background = validHex ? `${tool.color}15` : 'rgba(15, 23, 42, 0.08)';
          const iconContent = React.isValidElement(tool.icon) ? React.cloneElement(tool.icon, { size: 24 }) : null;

          return (
            <div
              key={tool.id}
              className="quick-card"
              onClick={() => {
                if (hubKey && typeof onSelectModule === 'function') {
                  onSelectModule(hubKey);
                } else {
                  console.warn('[BrandTestHub] onSelectModule called with invalid tool.hubKey', tool);
                }
              }}
            >
              <div className="quick-icon-box" style={{ background, color: validHex ? tool.color : '#0f172a' }}>
                {iconContent}
              </div>
              <h3 className="exam-title">{tool.title}</h3>
              <p className="exam-meta">TARGETED SKILL BUILDING</p>
              <p className="exam-description">{tool.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandTestHub;