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
  
  // Get all tasks flattened
  const allTasks = categories.flatMap(c => c.tasks || []);
  const b1Words = allTasks.filter(t => t.level === 'B1').flatMap(t => t.words || []);
  const b2Words = allTasks.filter(t => t.level === 'B2').flatMap(t => t.words || []);
  const c1Words = allTasks.filter(t => t.level === 'C1').flatMap(t => t.words || []);
  
  // Calculate completion for each level
  const b1Completion = b1Words.length > 0 ? calculateCompletion(b1Words, vocabProgress) : 0;
  const b2Completion = b2Words.length > 0 ? calculateCompletion(b2Words, vocabProgress) : 0;
  const c1Completion = c1Words.length > 0 ? calculateCompletion(c1Words, vocabProgress) : 0;
  
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
                const allTasks = categories.flatMap(c => c.tasks);
                const randomTask = allTasks[Math.floor(Math.random() * allTasks.length)];
                onSelectSection(randomTask ? { ...randomTask, type: 'VOCAB_FLASHCARDS', isRandomMix: true } : { type: 'VOCAB_FLASHCARDS', level: 'B1', tier: 'bronze' });
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
        
        {/* TRACK 1: B1 */}
        <section className="track-column">
          <div className="track-header">
            <h2 className="track-title">B1</h2>
            <span className="track-lvl">LVL. 08/12</span>
          </div>

          <div className="card-stack">
            <div className="prof-card active" onClick={() => {
              const b1Task = categories.flatMap(c => c.tasks).find(t => t.level === 'B1');
              onSelectSection(b1Task ? { ...b1Task, type: 'VOCAB_FLASHCARDS' } : { type: 'VOCAB_FLASHCARDS', level: 'B1', tier: 'bronze' });
            }}>
              <div className="card-top">
                <div>
                  <h3>Spaced-Repetition Flashcards</h3>
                  <p>Essential vocabulary for intermediate learners.</p>
                </div>
                <span className="xp-label featured">850 XP</span>
              </div>
              <div className="bar-bg"><div className="bar-fill" style={{width: `${b1Completion}%`}}></div></div>
              <div className="status-meta"><span>COMPLETION</span><span>{b1Completion}%</span></div>
            </div>
          </div>
        </section>

        {/* TRACK 2: B2 */}
        <section className="track-column">
          <div className="track-header">
            <h2 className="track-title">B2</h2>
            <span className="track-lvl">LVL. 08/12</span>
          </div>

          <div className="card-stack">
            <div className="prof-card active" onClick={() => {
              const b2Task = categories.flatMap(c => c.tasks).find(t => t.level === 'B2');
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
          </div>
        </section>

        {/* TRACK 3: C1 */}
        <section className="track-column">
          <div className="track-header">
            <h2 className="track-title">C1</h2>
            <span className="track-lvl">LVL. 02/12</span>
          </div>

          <div className="card-stack">
            <div className="prof-card active" onClick={() => {
              const c1Task = categories.flatMap(c => c.tasks).find(t => t.level === 'C1');
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
                <button className="level-b1" onClick={() => {
                  const task = cat.tasks?.find(t => t.level === 'B1') || cat.tasks?.[0];
                  onSelectSection(task ? { ...task, type: 'VOCAB_FLASHCARDS' } : { type: 'VOCAB_FLASHCARDS', level: 'B1', tier: 'bronze' });
                }}>B1</button>
                <button onClick={() => {
                  const task = cat.tasks?.find(t => t.level === 'B2') || cat.tasks?.[0];
                  onSelectSection(task ? { ...task, type: 'VOCAB_FLASHCARDS' } : { type: 'VOCAB_FLASHCARDS', level: 'B2', tier: 'bronze' });
                }}>B2</button>
                <button className="accent" onClick={() => {
                  const task = cat.tasks?.find(t => t.level === 'C1') || cat.tasks?.[0];
                  onSelectSection(task ? { ...task, type: 'VOCAB_FLASHCARDS' } : { type: 'VOCAB_FLASHCARDS', level: 'C1', tier: 'bronze' });
                }}>C1</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VocabHub;