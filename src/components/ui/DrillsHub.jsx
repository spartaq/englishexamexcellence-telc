import React from 'react';
import { Zap, Target, BookOpen, PenTool, ArrowRight, Layers } from 'lucide-react';
import './DrillsHub.css';

const categoryIcons = {
  'reading-drills': <BookOpen size={20} />,
  'grammar-drills': <PenTool size={20} />,
};

const DrillsHub = ({ data, onSelectSection, onStartTask }) => {
  const hub = data;
  if (!hub) return <div className="drills-loading">Initializing Drill Engine...</div>;

  const categories = hub.categories || [];

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
        <p className="drills-hub-subtitle">Targeted exercises to improve core English skills.</p>
      </header>

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
              const firstTask = categories[0]?.tasks?.[0];
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
        {categories.map(category => (
          <section key={category.id} className="drill-category">
            <div className="category-header">
              <div className="category-title-row">
                <div className="category-icon">{categoryIcons[category.id] || <Target size={20} />}</div>
                <h2 className="category-title">{category.title.toUpperCase()}</h2>
              </div>
              <span className="category-count">{category.tasks.length} DRILLS</span>
            </div>

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
        <h2 className="section-heading">DRILL TYPES</h2>
        <div className="drill-types-grid">
          <div className="drill-type-card">
            <div className="drill-type-icon"><BookOpen size={24} /></div>
            <h3>Reading Drills</h3>
            <p>Identify grammatical structures and patterns in academic texts.</p>
          </div>
          <div className="drill-type-card">
            <div className="drill-type-icon"><PenTool size={24} /></div>
            <h3>Grammar Drills</h3>
            <p>Master punctuation, syntax, and sentence structure.</p>
          </div>
          <div className="drill-type-card">
            <div className="drill-type-icon"><Target size={24} /></div>
            <h3>Precision Training</h3>
            <p>Targeted exercises for specific language competencies.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DrillsHub;
