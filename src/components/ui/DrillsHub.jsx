import React, { useMemo } from 'react';
import { Zap, Target, BookOpen, PenTool, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import './DrillsHub.css';

const categoryIcons = {
  'reading-drills': <BookOpen size={20} />,
  'writing-drills': <PenTool size={20} />,
  'language-elements': <Target size={20} />,
  'speaking-drills': <BookOpen size={20} />,
};

const categoryDescriptions = {
  'reading-drills': 'Master reading strategies for any text',
  'writing-drills': 'Write clearly and structure your thoughts',
  'language-elements': 'Grammar that serves you everywhere',
  'speaking-drills': 'Communicate with confidence and clarity',
};

const DrillsHub = ({ 
  data, 
  selectedLevel = null,
  onSelectSection,
  onStartTask,
  onNavigateToLevelSelector,
  onNavigateToLevel
}) => {
const hub = data;
   if (!hub) return <div className="drills-loading">Initializing Drill Engine...</div>;

   const categories = hub.categories || [];

   // Filter categories by selectedLevel (if provided)
   const filteredCategories = useMemo(() => {
     if (!selectedLevel) return categories;

     return categories
       .map(cat => ({
         ...cat,
         tasks: (cat.tasks || []).filter(task => task.level.toUpperCase() === selectedLevel)
       }))
       .filter(cat => cat.tasks.length > 0);
   }, [categories, selectedLevel]);

   // Flatten all tasks for the current view
   const allFilteredTasks = useMemo(() => {
     const tasks = filteredCategories.flatMap(c => c.tasks || []);
     return tasks;
   }, [filteredCategories]);

  // Calculate completion for current level (or overall if no level)
  // For now, we'll use a placeholder since we don't have progress tracking for drills yet
  const completionPercent = useMemo(() => {
    // Placeholder - in future, this would connect to drill progress
    return 0;
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
           (c.tasks || []).filter(t => t.level.toUpperCase() === level)
         );
         stats[level] = {
           drillCount: levelTasks.length,
           completion: 0 // Placeholder for future progress tracking
         };
       });
       return stats;
     }, [categories]);

    return (
      <div className="drills-hub">
        {/* HEADER */}
        <header className="drills-hub-header">
          <div className="header-top">
            <h1 className="drills-hub-title">DRILLS HUB</h1>
            <div className="system-tag">
              <span className="dot"></span> SYSTEM ACTIVE
            </div>
          </div>
          <p className="drills-hub-subtitle">Select your proficiency level to begin targeted skill training.</p>
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
                  onClick={() => onNavigateToLevel ? onNavigateToLevel(level) : window.location.href = `/telc/drillshub/${level.toLowerCase()}`}
                >
                  <div className="level-card-header">
                    <h2 className="level-title">{level}</h2>
                    <span className="level-badge">
                      {level === 'B1' ? 'Intermediate' : level === 'B2' ? 'Upper-Intermediate' : 'Advanced'}
                    </span>
                  </div>
                  <div className="level-card-body">
                    <p className="level-drill-count">{stats.drillCount} Skill Drills</p>
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
  // VIEW B: LEVEL SELECTED → Filtered Drill View
  // ==========================================

  return (
    <div className="drills-hub">
      {/* HEADER */}
      <header className="drills-hub-header">
        <div className="header-top">
          <h1 className="drills-hub-title">DRILLS HUB — {selectedLevel}</h1>
          <div className="system-tag">
            <span className="dot"></span> SYSTEM ACTIVE
          </div>
        </div>
        <p className="drills-hub-subtitle">
          {allFilteredTasks.length} targeted exercises for {selectedLevel} level
        </p>
        <p className="drills-hub-tagline">Skills that serve you beyond the exam</p>
      </header>

      {/* BACK TO LEVEL SELECTOR */}
      <div className="hub-nav-bar">
        <button className="back-link" onClick={onNavigateToLevelSelector}>
          <ArrowLeft size={16} /> All Levels
        </button>
      </div>

      {/* QUICK START HERO */}
      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-main">
            <div className="badge-row">
              <span className="engine-badge"><Zap size={14} /> DRILL ENGINE</span>
            </div>
            <h2>QUICK DRILL</h2>
            <p>Initiate high-intensity randomized grammar and reading drills.</p>
            <button className="btn-hero" onClick={() => {
              const firstTask = allFilteredTasks[0];
              onSelectSection(firstTask ? { ...firstTask, type: firstTask.type || 'reading-drill', isRandomMix: true } : { type: 'reading-drill', tier: 'bronze' });
            }}>
              START RANDOM PRACTICE <Layers size={18} />
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-box">
              <span className="label">ACCURACY</span>
              <span className="value">87.5%</span>
            </div>
            <div className="stat-box">
              <span className="label">DAILY TARGET</span>
              <div className="mini-progress"><div className="fill" style={{width: '40%'}}></div></div>
              <span className="sub">4/10 DRILLS</span>
            </div>
          </div>
        </div>
      </section>

      {/* DRILL CATEGORIES GRID */}
      <div className="drills-grid">
        {filteredCategories.map(category => (
          <section key={category.id} className="drill-category">
            <div className="category-header">
              <div className="category-title-row">
                <div className="category-icon">{categoryIcons[category.id] || <Target size={20} />}</div>
                <h2 className="category-title">{category.title.toUpperCase()}</h2>
              </div>
              <span className="category-count">{category.tasks.length} DRILLS</span>
            </div>
            <p className="category-description">{categoryDescriptions[category.id] || ''}</p>

            <div className="drill-cards">
              {category.tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={`drill-card ${index === 0 ? 'active' : ''}`}
                  onClick={() => onStartTask ? onStartTask(task) : onSelectSection({ ...category, selectedTask: task })}
                >
                  <div className="drill-card-top">
                    <div className="drill-info">
                      <h3>{task.title}</h3>
                      <p className="drill-type">{task.type.replace(/-/g, ' ').toUpperCase()}</p>
                    </div>
                    <span className="xp-badge">{task.xp} XP</span>
                  </div>
                  <div className="drill-card-bottom">
                    <div className="tier-badge">{task.tier.toUpperCase()}</div>
                    <div className="drill-action">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* DRILL TYPES OVERVIEW */}
      <section className="drill-types-section">
        <h2 className="section-heading">AVAILABLE DRILLS</h2>
        <div className="drill-types-grid">
          {allFilteredTasks.map((task, index) => (
            <div 
              key={task.id} 
              className="drill-type-card"
              onClick={() => onStartTask ? onStartTask(task) : onSelectSection({ ...task, type: task.type || 'reading-drill', isRandomMix: true })}
            >
              <div className="drill-type-icon">{categoryIcons[task.type.split('-')[0] + '-drills'] || <Target size={24} />}</div>
              <h3>{task.title}</h3>
              <p>{task.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
              <span className="xp-badge">{task.xp} XP</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DrillsHub;
