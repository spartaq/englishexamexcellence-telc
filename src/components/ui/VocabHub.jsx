import React, { useMemo } from 'react';
import { Trophy, Zap, Layers, Activity, Book, Globe, Shield, School, Lock, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import './VocabHub.css';

const topicIcons = {
  'Environment & Ecology': <Globe size={20} />,
  'Sociology & Psychology': <Shield size={20} />,
  'Business & Economics': <Activity size={20} />,
  'Technology': <Zap size={20} />,
  'Education': <School size={20} />,
  'Health & Well-being': <Book size={20} />,
  'Science & Nature': <Globe size={20} />,
  'Sports & Events': <Activity size={20} />,
  'Physics & Time': <Book size={20} />,
  'Community & Facilities': <Shield size={20} />,
  'Employment': <Activity size={20} />,
  'History & Communication': <BookOpen size={20} />,
  'General & Misc': <Layers size={20} />
};

// Calculate completion percentage for a set of words
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
    return !p || p.nextReview <= now;
  }).length;
};

const VocabHub = ({
  data,
  selectedLevel = null,
  onSelectSection,
  onNavigateToMyWords,
  onNavigateToLevelSelector,
  onNavigateToLevel
}) => {
  const hub = data;
  const vocabProgress = useExamStore(state => state.vocabProgress);

  if (!hub) return <div className="invictus-loading">Initializing Lexical Engine...</div>;

  const categories = hub.categories || [];

  // Filter categories by selectedLevel (if provided)
  const filteredCategories = useMemo(() => {
    if (!selectedLevel) return categories;

    return categories
      .map(cat => ({
        ...cat,
        tasks: (cat.tasks || []).filter(task => task.level === selectedLevel)
      }))
      .filter(cat => cat.tasks.length > 0);
  }, [categories, selectedLevel]);

  // Flatten all tasks and words for the current view
  const allFilteredTasks = useMemo(() => {
    return filteredCategories.flatMap(c => c.tasks || []);
  }, [filteredCategories]);

  const allFilteredWords = useMemo(() => {
    return allFilteredTasks.flatMap(t => t.words || []);
  }, [allFilteredTasks]);

  // Calculate completion for current level (or overall if no level)
  const completionPercent = useMemo(() => {
    return calculateCompletion(allFilteredWords, vocabProgress);
  }, [allFilteredWords, vocabProgress]);

  // Calculate total due words
  const totalDueWords = useMemo(() => {
    return allFilteredTasks.reduce((sum, task) => {
      return sum + calculateDueWords(task.words, vocabProgress);
    }, 0);
  }, [allFilteredTasks, vocabProgress]);

  // Get quick flash task for selected level
  const quickFlashTask = useMemo(() => {
    return allFilteredTasks.find(t => t.isQuickFlash) || allFilteredTasks[0];
  }, [allFilteredTasks]);

  // ==========================================
  // VIEW A: NO LEVEL SELECTED → Level Selector Cards
  // ==========================================
  if (!selectedLevel) {
    // Compute stats per level across all topics
    const levelStats = useMemo(() => {
      const stats = {};
      ['B1', 'B2', 'C1'].forEach(level => {
        const levelTasks = categories.flatMap(c =>
          (c.tasks || []).filter(t => t.level === level)
        );
        const levelWords = levelTasks.flatMap(t => t.words || []);
        stats[level] = {
          wordCount: levelWords.length,
          completion: calculateCompletion(levelWords, vocabProgress)
        };
      });
      return stats;
    }, [categories, vocabProgress]);

    return (
      <div className="invictus-vocab-hub">
        {/* HEADER */}
        <header className="invictus-hub-header">
          <div className="header-top">
            <h1 className="invictus-hub-title">VOCABULARY LAB</h1>
            <div className="system-tag">
              <span className="dot"></span> SYSTEM ACTIVE
            </div>
          </div>
          <p className="invictus-hub-subtitle">Select your proficiency level to begin targeted lexical training.</p>
        </header>

        {/* LEVEL SELECTOR GRID */}
        <section className="level-selector-section">
          <div className="level-cards-grid">
            {['B1', 'B2', 'C1'].map(level => {
              const stats = levelStats[level];
              return (
                <div
                  key={level}
                  className={`level-selector-card level-${level.toLowerCase()}`}
                  onClick={() => onNavigateToLevel ? onNavigateToLevel(level) : window.location.href = `/telc/vocabulary/${level.toLowerCase()}`}
                >
                  <div className="level-card-header">
                    <h2 className="level-title">{level}</h2>
                    <span className="level-badge">{level === 'B1' ? 'Intermediate' : level === 'B2' ? 'Upper-Intermediate' : 'Advanced'}</span>
                  </div>
                  <div className="level-card-body">
                    <p className="level-word-count">{stats.wordCount.toLocaleString()} Academic Tokens</p>
                    <div className="level-progress">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${stats.completion}%` }}></div>
                      </div>
                      <span className="progress-label">{stats.completion}% Mastered</span>
                    </div>
                  </div>
                  <div className="level-card-footer">
                    <span className="start-button">Enter Level</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW B: LEVEL SELECTED → Filtered Topic View
  // ==========================================

  // Due words count across all filtered categories
  const filteredTotalDueWords = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => {
      const catDue = (cat.tasks || []).reduce((taskSum, task) => {
        return taskSum + calculateDueWords(task.words, vocabProgress);
      }, 0);
      return sum + catDue;
    }, 0);
  }, [filteredCategories, vocabProgress]);

  return (
    <div className="invictus-vocab-hub">
      {/* HEADER */}
      <header className="invictus-hub-header">
        <div className="header-top">
          <h1 className="invictus-hub-title">VOCABULARY LAB — {selectedLevel}</h1>
          <div className="system-tag">
            <span className="dot"></span> SYSTEM ACTIVE
          </div>
        </div>
        <p className="invictus-hub-subtitle">
          {allFilteredWords.length.toLocaleString()} academic tokens across {filteredCategories.length} topics
        </p>
      </header>

      {/* BACK TO LEVEL SELECTOR */}
      <div className="hub-nav-bar">
        <button className="back-link" onClick={onNavigateToLevelSelector}>
          <ArrowLeft size={16} /> All Levels
        </button>
        <button className="my-words-link" onClick={onNavigateToMyWords}>
          My Words
        </button>
      </div>

      {/* SINGLE PROFICIENCY TRACK (for selected level) */}
      <section className="proficiency-grid">
        <section className="track-column">
          <div className="track-header">
            <h2 className="track-title">{selectedLevel}</h2>
            <span className="track-lvl">
              {selectedLevel === 'B1' ? 'LVL. 08/12' : selectedLevel === 'B2' ? 'LVL. 08/12' : 'LVL. 02/12'}
            </span>
          </div>

          <div className="prof-card active" onClick={() => {
            if (quickFlashTask) {
              onSelectSection({ ...quickFlashTask, type: 'VOCAB_FLASHCARDS', isRandomMix: true });
            }
          }}>
                <div className="card-top">
                  <div>
                    <h3>{selectedLevel} Spaced-Repetition Flashcards</h3>
                    <p>Mixed-topic randomized practice for comprehensive retention.</p>
                  </div>
                  <span className="xp-label featured">
                    {selectedLevel === 'C1' ? '2500 XP' : '850 XP'}
                  </span>
                </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${completionPercent}%` }}></div>
            </div>
            <div className="status-meta">
              <span>COMPLETION</span>
              <span>{completionPercent}%</span>
            </div>
          </div>
        </section>
      </section>

      {/* TOPICAL MASTERY (filtered to selected level) */}
      <section className="topics-section">
        <h2 className="section-heading">TOPICAL MASTERY</h2>
        <div className="topics-grid">
          {filteredCategories.map(cat => {
            // For selected level, each topic should have exactly 1 task (or 0)
            const task = cat.tasks[0];
            return (
              <div key={cat.id} className="topic-card-minimal">
                <div className="topic-info">
                  <div className="topic-icon-hex">{topicIcons[cat.title] || <Layers size={20} />}</div>
                  <span className="topic-name">{cat.title.toUpperCase()}</span>
                </div>
                <div className="topic-actions">
                  <button
                    className={
                      selectedLevel === 'B1' ? 'level-b1' :
                      selectedLevel === 'B2' ? 'level-b2' : 'accent'
                    }
                    onClick={() => task && onSelectSection({ ...task, type: 'VOCAB_FLASHCARDS' })}
                  >
                    {selectedLevel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DUE WORDS QUICK ACTION (if any) */}
  {filteredTotalDueWords > 0 && (
    <section className="due-words-section">
      <div className="due-words-card" onClick={() => {
        // Collect all due words across all filtered tasks
        const dueWords = [];
        filteredCategories.forEach(cat => {
          (cat.tasks || []).forEach(task => {
            (task.words || []).forEach(word => {
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
            words: dueWords.slice(0, 20),
            isRandomMix: true,
            title: 'Review Due Words',
            level: selectedLevel
          });
        }
      }}>
        <div className="due-info">
          <span className="due-label">REVIEW QUEUE</span>
          <span className="due-count">{filteredTotalDueWords} words ready</span>
        </div>
        <ArrowRight size={20} />
      </div>
    </section>
  )}
    </div>
  );
};

export default VocabHub;
