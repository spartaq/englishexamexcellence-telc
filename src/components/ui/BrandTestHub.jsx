import React from 'react';
import { useUser } from '@clerk/react';
import { 
  Zap, Clock, BookOpen, Info, List, Shuffle, 
  Timer, Library, GraduationCap, Lock, Search, 
  Mic, Headset, PenTool, FileText
} from 'lucide-react';

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
        <div><span className="hero-badge">{levelBadge}</span>
          <h2 className="hero-title">{"Welcome Back, John" || activeTest?.title || `${levelTitle} Hub`}</h2>
          <p className="hero-subtitle">
            Cycling Slogan
          </p></div>
        <div className="hero-content">
          
          
          {/* TEACHER'S MESSAGE */}
          <div className="header-note">
            <h2>What should you practice today?</h2> 
          <p>
            Vocab progress bar
          </p> 
             <p>
            Tests progress bar
          </p> 
          <p>
           Drills progress bar
          </p>
           <div className="hero-actions">
            <button className="btn-white" onClick={() => onSelectPath(singleExercisePath)}>
              Jump in!
            </button>
          </div>
          </div>
        
        </div>

        
          
         
      
        
      </header>

      {/* --- 2. TRAINING VS TESTING SECTION --- */}
      <div className="section-header">
        <h2 className="section-title">The Real Solution</h2>
        <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>Targeted vocabulary and skill mastery beats endless testing</p>
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
                  // Pass current level for vocabulary and drillshub tools
                  const levelToPass = ['vocabulary', 'drillshub'].includes(hubKey) ? level : null;
                  onSelectModule(hubKey, levelToPass);
                } else {
                  console.warn('[BrandTestHub] onSelectModule called with invalid tool.hubKey', tool);
                }
              }}
            >
              <div className="quick-icon-box" style={{ background, color: validHex ? tool.color : '#0f172a' }}>
                {iconContent}
              </div>
              <h3 className="exam-title">{tool.title}</h3>
              <p className="exam-meta">SKILL BUILDING</p>
              <p className="exam-description">{tool.description}</p>
            </div>
          );
        })}
      </div>

       {/* --- 3. CHECK PROGRESS & SKILL PRACTICE (SIDE BY SIDE) --- */}
       <div className="dual-section-container">
         <div className="dual-section-box">
           <div className="section-header">
             <h2 className="section-title">Check Progress</h2>
             <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>Review your development after building foundations</p>
           </div>

           <div className="quick-card">
             <div className="archive-controls">
               <div className="search-input-wrapper">
                 <Search size={20} style={{ position: 'absolute', left: '16px', top: '18px', color: '#94a3b8' }} />
                  <input type="text" placeholder="Search mocks by number or title..." aria-label="Search mocks by number or title" />
               </div>
               <div className="filter-tabs">
                 <button className="filter-tab active">All Mocks</button>
                 <button className="filter-tab">Bronze</button>
                 <button className="filter-tab">Gold</button>
               </div>
             </div>

             <div className="exam-list-scroll">
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
         </div>

         <div className="dual-section-box">
           <div className="section-header">
             <h2 className="section-title">Skill Practice</h2>
           </div>

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
         </div>
       </div>
    </div>
  );
};

export default BrandTestHub;