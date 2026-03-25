import React from 'react';
import { useUser } from '@clerk/react';
import { 
  Zap, Clock, BookOpen, Info, List, Shuffle, 
  Timer, Library, GraduationCap, Lock, Search 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import your registry
import { ieltsMocks } from '../../data/IELTS/mocks';

// Import the Stitch Stylesheet
import './BrandTestHub.css';

const BrandTestHub = ({ 
    activeTest, 
    onSelectPath, 
    onSelectModule, 
    EXTRA_TOOLS,
    onOpenPaywall
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

  return (
    <div className="ielts-hub-container">
      <title>{activeTest.title} Hub - Training & Practice</title>

      {/* --- 1. WELCOME HERO SECTION --- */}
      <header className="ielts-hero-banner">
        <div className="hero-content">
          <span className="hero-badge">Exam Training System</span>
          <h1 className="hero-title">{activeTest.title}</h1>
          <p className="hero-subtitle">
            Stop practicing. Start training. Build skills daily with Atoms, 
            or test your stamina with our full mock exam archive.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => onSelectPath('random-mock')}>
              Quick Start
            </button>
            <Link to="/ielts-info" className="btn-outline-white" style={{ textDecoration: 'none' }}>
              Exam Info
            </Link>
          </div>
        </div>

        {/* Level Indicator Card */}
        <div className="level-card">
          <p style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', opacity: 0.8 }}>CURRENT STATUS</p>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
            {userTier.toUpperCase()}
          </h3>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>
            {userTier === 'gold' ? 'Full Access Unlocked' : 'Upgrade to Gold for 30+ Mocks'}
          </p>
          <div className={`tier-badge ${userTier}`} style={{ marginTop: '16px' }}>
             Active Plan
          </div>
        </div>
      </header>

      {/* --- 2. QUICK START SECTION (ATOMS) --- */}
      <div className="ielts-section-header">
        <h2 className="ielts-section-title">Daily Skill Training (Atoms)</h2>
      </div>

      <div className="quick-start-grid">
        <div className="quick-card" onClick={() => onSelectPath('ielts-general-mini-test')}>
          <div className="quick-icon-box"><Shuffle size={24} /></div>
          <h3 className="exam-title">General Random</h3>
          <p className="exam-meta">15 MIN • ALL SKILLS</p>
        </div>

        <div className="quick-card" onClick={() => onSelectPath('ielts-academic-mini-test')}>
          <div className="quick-icon-box"><BookOpen size={24} /></div>
          <h3 className="exam-title">Academic Random</h3>
          <p className="exam-meta">15 MIN • ALL SKILLS</p>
        </div>

        <div className="quick-card" onClick={() => onSelectPath('skill-tests')}>
          <div className="quick-icon-box"><List size={24} /></div>
          <h3 className="exam-title">Specific Skills</h3>
          <p className="exam-meta">CHOOSE YOUR ATOM</p>
        </div>
      </div>

      {/* --- 3. THE EXAM ARCHIVE (MOCK LIBRARY) --- */}
      <div className="ielts-section-header">
        <h2 className="ielts-section-title">Full Mock Exam Archive</h2>
      </div>

      <div className="exam-archive-container">
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
          {Object.values(ieltsMocks)
            .filter(mock => mock.type === activeTest.id || (activeTest.id === 'ielts' && (mock.type === 'general' || mock.type === 'academic')))
            .map(mock => {
              const hasAccess = canAccess(mock.tier);
              
              return (
                <div key={mock.id} className={`exam-list-item ${!hasAccess ? 'locked-item' : ''}`}>
                  <div className="exam-id">#{mock.mockNumber}</div>
                  <div className="exam-info">
                    <div className="exam-title">
                        {mock.title} 
                        {!hasAccess && <Lock size={14} style={{ marginLeft: '8px', color: '#94a3b8' }} />}
                    </div>
                    <div className="exam-meta">
                      <span>{mock.type}</span>
                      <span>•</span>
                      <span className={`tier-text ${mock.tier}`}>{mock.tier.toUpperCase()} TIER</span>
                    </div>
                  </div>
                  
                  <button 
                    className={hasAccess ? "btn-start-exam" : "btn-hub"}
                    onClick={() => hasAccess ? onSelectPath(mock.type === 'general' ? 'ielts-general-full-test' : 'ielts-academic-full-test') : onOpenPaywall()}
                  >
                    {hasAccess ? "Start Mock" : "Unlock Gold"}
                  </button>
                </div>
              );
          })}
        </div>
      </div>

      {/* --- 4. PRECISION TRAINING (EXTRA TOOLS) --- */}
      <div className="ielts-section-header">
        <h2 className="ielts-section-title">Precision Training Labs</h2>
      </div>

      <div className="precision-grid">
        {EXTRA_TOOLS && EXTRA_TOOLS.map(tool => (
          <div key={tool.id} className="hub-card">
            <div className="hub-header">
                <div className="quick-icon-box" style={{ background: `${tool.color}15`, color: tool.color }}>
                    {React.cloneElement(tool.icon, { size: 24 })}
                </div>
                <h3 className="exam-title">{tool.title}</h3>
            </div>
            <div className="hub-body">
              <p className="exam-meta" style={{ marginBottom: '12px' }}>{tool.description}</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#64748b' }}>
                <li style={{ marginBottom: '4px' }}>✓ Targeted Skill Building</li>
                <li>✓ Instant XP Rewards</li>
              </ul>
            </div>
            <div className="hub-footer">
              <button 
                className="btn-hub" 
                onClick={() => onSelectModule(tool.hubKey)}
              >
                Enter {tool.title.split(' ').pop()} Lab
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandTestHub;