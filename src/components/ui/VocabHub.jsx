import React from 'react';
import { Trophy, Zap, Layers, Activity, Book, Globe, Shield, School, Lock, ArrowRight } from 'lucide-react';
import './VocabHub.css';

const topicIcons = {
  'Environment & Ecology': <Globe size={20} />,
  'Society & Culture': <Shield size={20} />,
  'Technology & Innovation': <Zap size={20} />,
  'Business & Economics': <Activity size={20} />,
  'Health & Science': <Book size={20} />,
  'Education': <School size={20} />
};

const VocabHub = ({ data, onSelectSection }) => {
  const hub = data;
  if (!hub) return <div className="invictus-loading">Initializing Lexical Engine...</div>;

  const categories = hub.categories || [];

  return (
    <div className="invictus-vocab-hub">
      {/* HEADER */}
      <header className="invictus-hub-header">
        <div className="header-top">
          <h1 className="invictus-hub-title">VOCABULARY HUB</h1>
          <div className="system-tag">
            <span className="dot"></span> SYSTEM ACTIVE
          </div>
        </div>
        <p className="invictus-hub-subtitle">Precision lexical training for high-stakes exams.</p>
      </header>

      {/* QUICK START HERO */}
      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-main">
            <div className="badge-row">
              <span className="engine-badge"><Zap size={14} /> ASSESSMENT ENGINE</span>
            </div>
            <h2>QUICK FLASH</h2>
            <p>Initiate high-intensity randomized sessions across 12,000 academic tokens.</p>
            <button className="btn-hero" onClick={() => {
              const c1Task = categories[0]?.tasks?.find(t => t.level === 'C1') || categories[0]?.tasks?.[1] || categories[0]?.tasks?.[0];
              onSelectSection(c1Task ? { ...c1Task, type: 'VOCAB_FLASHCARDS', isRandomMix: true } : { type: 'VOCAB_FLASHCARDS', level: 'C1', tier: 'bronze' });
            }}>
              START RANDOM PRACTICE <Layers size={18} />
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-box">
              <span className="label">ACCURACY</span>
              <span className="value">94.2%</span>
            </div>
            <div className="stat-box">
              <span className="label">DAILY TARGET</span>
              <div className="mini-progress"><div className="fill" style={{width: '65%'}}></div></div>
              <span className="sub">65/100 WORDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROFICIENCY TRACKS GRID */}
      <div className="proficiency-grid">
        
        {/* TRACK 1: GENERAL */}
        <section className="track-column">
          <div className="track-header">
            <h2 className="track-title">IELTS GENERAL (B2)</h2>
            <span className="track-lvl">LVL. 08/12</span>
          </div>

          <div className="card-stack">
            <div className="prof-card active" onClick={() => {
              const b2Task = categories[0]?.tasks?.find(t => t.level === 'B2') || categories[0]?.tasks?.[0];
              onSelectSection(b2Task ? { ...b2Task, type: 'VOCAB_FLASHCARDS' } : { type: 'VOCAB_FLASHCARDS', level: 'B2', tier: 'bronze' });
            }}>
              <div className="card-top">
                <div>
                  <h3>Spaced-Repetition Flashcards</h3>
                  <p>Neural retention anchoring via incremental recall.</p>
                </div>
                <span className="xp-label featured">850 XP</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: '65%'}}></div></div>
              <div className="status-meta"><span>COMPLETION</span><span>65%</span></div>
            </div>

            <div className="prof-card" onClick={() => onSelectSection(categories[0])}>
              <div className="card-top">
                <div>
                  <h3>Synonym Matching Matrix</h3>
                  <p>Cross-referencing semantic clusters.</p>
                </div>
                <span className="xp-label">420 XP</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: '12%'}}></div></div>
              <div className="status-meta"><span>COMPLETION</span><span>12%</span></div>
            </div>
          </div>
        </section>

        {/* TRACK 2: ACADEMIC */}
        <section className="track-column">
          <div className="track-header">
            <h2 className="track-title">IELTS ACADEMIC (C1)</h2>
            <span className="track-lvl">LVL. 02/12</span>
          </div>

          <div className="card-stack">
            <div className="prof-card active" onClick={() => {
              const c1Task = categories[1]?.tasks?.find(t => t.level === 'C1') || categories[1]?.tasks?.[0];
              onSelectSection(c1Task ? { ...c1Task, type: 'VOCAB_FLASHCARDS' } : { type: 'VOCAB_FLASHCARDS', level: 'C1', tier: 'bronze' });
            }}>
              <div className="card-top">
                <div>
                  <h3>Advanced Flashcards</h3>
                  <p>Lexical mastery of complex abstract constructs.</p>
                </div>
                <span className="xp-label featured">2500 XP</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: '18%'}}></div></div>
              <div className="status-meta"><span>COMPLETION</span><span>18%</span></div>
            </div>

            <div className="prof-card locked">
              <div className="card-top">
                <div>
                  <h3>Usage Drills</h3>
                  <p>Syntactic synthesis in high-stakes scenarios.</p>
                </div>
                <Lock size={16} />
              </div>
              <p className="lock-text">REQUIRES LEVEL 05 AUTHORIZATION</p>
            </div>
          </div>
        </section>
      </div>

      {/* TOPICAL MASTERY SECTION */}
      <section className="topics-section">
        <h2 className="section-heading">TOPICAL MASTERY</h2>
        <div className="topics-grid">
          {categories.map(cat => (
            <div key={cat.id} className="topic-card-minimal">
              <div className="topic-info">
                <div className="topic-icon-hex">{topicIcons[cat.title]}</div>
                <span className="topic-name">{cat.title.toUpperCase()}</span>
              </div>
              <div className="topic-actions">
                <button onClick={() => onSelectSection(cat)}>B2</button>
                <button className="accent" onClick={() => onSelectSection(cat)}>C1</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VocabHub;