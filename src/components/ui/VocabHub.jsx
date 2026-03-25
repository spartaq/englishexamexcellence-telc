import React from 'react';
import { Trophy, Zap, Layers, Activity, Book, Globe, Shield, School } from 'lucide-react';
import './VocabHub.css';

const topicIcons = {
  'Environment & Ecology': <Globe size={24} />,
  'Society & Culture': <Shield size={24} />,
  'Technology & Innovation': <Zap size={24} />,
  'Business & Economics': <Activity size={24} />,
  'Health & Science': <Book size={24} />,
  'Education': <School size={24} />
};

const VocabHub = ({ data, onSelectSection }) => {
  const hub = data;
  if (!hub) return <div className="invictus-loading">Initializing Lexical Engine...</div>;

  const categories = hub.categories || [];

  const handleQuickFlash = (level) => {
    // Logic to pluck random words based on level
    onSelectSection({
      id: `quickflash_${level}`,
      type: 'VOCAB_FLASHCARDS',
      title: `Quick Flash - ${level}`,
      isRandomMix: true,
      level: level
    });
  };

  return (
    <div className="invictus-vocab-hub">
      <header className="invictus-hub-header">
        <h1 className="invictus-hub-title">VOCABULARY<br />HUB</h1>
        <div className="invictus-system-status">
          <span className="status-label">SYSTEM STATUS</span>
        </div>
        <p className="invictus-hub-subtitle">Precision lexical training for high-stakes exams.</p>
      </header>

      {/* QUICK FLASH HERO */}
      <section className="invictus-hero-section">
        <div className="hero-main-card">
          <div className="hero-content">
            <div className="hero-tag">
              <Zap size={16} fill="currentColor" />
              <span>ASSESSMENT ENGINE</span>
            </div>
            <h2 className="hero-title">QUICK FLASH</h2>
            <p className="hero-description">
              Initiate a high-intensity randomized session across all 12,000 academic tokens. 
              Designed for rapid retention under simulated pressure.
            </p>
            <button className="btn-hero-primary" onClick={() => handleQuickFlash('C1')}>
              START RANDOM PRACTICE <Layers size={18} />
            </button>
          </div>
          <div className="hero-stats-panel">
            <div className="stat-item">
              <span className="stat-label">LAST SESSION</span>
              <span className="stat-value">94.2%</span>
              <span className="stat-subtext">Accuracy rating on C2-tier words</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">DAILY TARGET</span>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '65%' }}></div>
              </div>
              <div className="progress-meta">
                <span>65 / 100 WORDS</span>
                <span>65%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE TRACKS */}
      <section className="invictus-tracks-grid">
        <div className="track-card">
          <span className="track-tag">CORE PROFICIENCY</span>
          <h3 className="track-title">IELTS GENERAL (B2)</h3>
          <p className="track-description">
            Foundation lexical sets focused on social context, workplace communication, and day-to-day high-stakes interaction patterns.
          </p>
          <button className="track-link" onClick={() => onSelectSection(categories[0])}>
            BROWSE WORD LIST <Layers size={14} />
          </button>
        </div>
        <div className="track-card featured">
          <span className="track-tag">ADVANCED MASTERY</span>
          <h3 className="track-title">IELTS ACADEMIC (C1)</h3>
          <p className="track-description">
            Sophisticated terminology for university-level discourse. Focus on abstract concepts, synthesis, and critical analysis terminology.
          </p>
          <button className="track-link" onClick={() => onSelectSection(categories[1])}>
            BROWSE WORD LIST <Layers size={14} />
          </button>
        </div>
      </section>

      {/* TOPICAL MASTERY */}
      <section className="invictus-topics-section">
        <div className="section-header">
          <h2 className="section-title">TOPICAL MASTERY</h2>
        </div>
        <div className="topics-grid">
          {categories.map(cat => {
            // Find the B2 (General) and C1 (Academic) tasks for this category
            const generalTask = cat.tasks?.find(t => t.level === 'B2');
            const academicTask = cat.tasks?.find(t => t.level === 'C1');
            
            return (
              <div key={cat.id} className="topic-card">
                <div className="topic-icon">{topicIcons[cat.title] || <Layers size={20} />}</div>
                <span className="topic-label">{cat.title.toUpperCase()}</span>
                <div className="topic-level-btns">
                  <button 
                    className="level-btn academic" 
                    onClick={() => academicTask && onSelectSection(academicTask)}
                    disabled={!academicTask}
                  >
                    ACADEMIC (C1)
                  </button>
                  <button 
                    className="level-btn general" 
                    onClick={() => generalTask && onSelectSection(generalTask)}
                    disabled={!generalTask}
                  >
                    GENERAL (B2)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PERFORMANCE TRAJECTORY */}
      <section className="invictus-analytics-preview">
         <div className="analytics-card">
           <span className="card-label">PERFORMANCE TRAJECTORY</span>
           <div className="chart-placeholder">
             {/* Simple visual representation of the bar chart from design */}
             {[40, 60, 50, 70, 85, 100].map((h, i) => (
               <div key={i} className={`chart-bar ${i === 5 ? 'active' : ''}`} style={{ height: `${h}%` }}>
                 <span className="bar-label">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'CURRENT'][i]}</span>
               </div>
             ))}
           </div>
         </div>
         <div className="rank-card">
            <Trophy size={32} className="rank-icon" />
            <h3 className="rank-title">GLOBAL RANK</h3>
            <p className="rank-description">Top 0.8% of participants worldwide in the 2024 Academic Lexicon bracket.</p>
            <div className="rank-number">#1,204</div>
         </div>
      </section>
    </div>
  );
};

export default VocabHub;