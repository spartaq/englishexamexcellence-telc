import React from 'react';
import { Trophy, Zap, Layers, Activity, Book, Globe, Shield, School, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import './VocabHub.css';

const topicIcons = {
  'Environment & Ecology': <Globe size={20} />,
  'Society & Culture': <Shield size={20} />,
  'Technology & Innovation': <Zap size={20} />,
  'Business & Economics': <Activity size={20} />,
  'Health & Science': <Book size={20} />,
  'Education': <School size={20} />
};

// Calculate completion percentage based on vocabProgress
const calculateCompletion = (words, progress) => {
  if (!words || words.length === 0) return 0;
  const mastered = words.filter(w => {
    const p = progress[w.term];
    return p && p.level >= 3; // Level 3+ = mastered
  }).length;
  return Math.round((mastered / words.length) * 100);
};

// Calculate due words count (words ready for review)
const calculateDueWords = (words, progress) => {
  if (!words || words.length === 0) return 0;
  const now = Date.now();
  return words.filter(w => {
    const p = progress[w.term];
    // Due if: no progress yet, or nextReview <= now
    return !p || p.nextReview <= now;
  }).length;
};

const VocabHub = ({ data, onSelectSection, onNavigateToMyWords }) => {
  const hub = data;
  const vocabProgress = useExamStore(state => state.vocabProgress);
  
  if (!hub) return <div className="invictus-loading">Initializing Lexical Engine...</div>;

  const categories = hub.categories || [];
  
  // Calculate completion for each category
  const b2Completion = categories[0]?.tasks?.[0]?.words 
    ? calculateCompletion(categories[0].tasks[0].words, vocabProgress) 
    : 0;
  const c1Completion = categories[1]?.tasks?.[0]?.words 
    ? calculateCompletion(categories[1].tasks[0].words, vocabProgress) 
    : 0;
  
  // Calculate due words count across all categories
  const totalDueWords = categories.reduce((sum, cat) => {
    const catDue = cat.tasks?.reduce((taskSum, task) => {
      return taskSum + calculateDueWords(task.words, vocabProgress);
    }, 0) || 0;
    return sum + catDue;
  }, 0);

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
            <div className="hero-buttons">
              <button className="btn-hero" onClick={() => {
                const c1Task = categories[0]?.tasks?.find(t => t.level === 'C1') || categories[0]?.tasks?.[1] || categories[0]?.tasks?.[0];
                onSelectSection(c1Task ? { ...c1Task, type: 'VOCAB_FLASHCARDS', isRandomMix: true } : { type: 'VOCAB_FLASHCARDS', level: 'C1', tier: 'bronze' });
              }}>
                START RANDOM PRACTICE <Layers size={18} />
              </button>
              <button className="btn-hero secondary" onClick={onNavigateToMyWords}>
                <BookOpen size={18} /> MY WORDS
              </button>
            </div>
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
            {totalDueWords > 0 && (
              <button
                type="button"
                className="stat-box due-words-box"
                onClick={() => {
                  const dueWords = [];
                  categories.forEach(cat => {
                    cat.tasks?.forEach(task => {
                      task.words?.forEach(word => {
                        const p = vocabProgress[word.term];
                        if (!p || p.nextReview <= Date.now()) {
                          dueWords.push(word);
                        }
                      });
                    });
                  });
                  if (dueWords.length > 0) {
                    onSelectSection({ 
                      type: 'VOCAB_FLASHCARDS', 
                      words: dueWords.slice(0, 20), // Limit to 20 words
                      isRandomMix: true,
                      title: 'Review Due Words'
                    });
                  }
                }}
                aria-label="Start review of due words"
              >
                <span className="label">DUE FOR REVIEW</span>
                <span className="value due-count">{totalDueWords}</span>
                <span className="sub">WORDS READY</span>
              </button>
            )}
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
              <div className="bar-bg"><div className="bar-fill" style={{width: `${b2Completion}%`}}></div></div>
              <div className="status-meta"><span>COMPLETION</span><span>{b2Completion}%</span></div>
            </div>

            <div className="prof-card" onClick={() => onSelectSection(categories[0])}>
              <div className="card-top">
                <div>
                  <h3>Synonym Matching Matrix</h3>
                  <p>Cross-referencing semantic clusters.</p>
                </div>
                <span className="xp-label">420 XP</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: `${b2Completion}%`}}></div></div>
              <div className="status-meta"><span>COMPLETION</span><span>{b2Completion}%</span></div>
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
              <div className="bar-bg"><div className="bar-fill" style={{width: `${c1Completion}%`}}></div></div>
              <div className="status-meta"><span>COMPLETION</span><span>{c1Completion}%</span></div>
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