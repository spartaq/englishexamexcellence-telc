import React from 'react';
import { ArrowLeft, Trophy, Dumbbell } from 'lucide-react';
import './hub.css';

const icons = { 'mock-tests': Trophy, 'skill-drills': Dumbbell };

const SkillHub = ({ data, onBack, onSelectSection, backButtonText = 'Back' }) => {
  // Use the passed data prop directly
  const hub = data;

  if (!hub) return <div style={{padding: '40px'}}>Hub data coming soon!</div>;

  // Safety check: ensure categories is an array
  const categories = hub.categories || [];

  // Check if this is Vocab Lab
  const isVocabLab = hub.title === 'Vocab Lab';

  // For each category, get the levels available
  const getCategoryLevels = (category) => {
    const levels = new Set();
    if (category.tasks) {
      category.tasks.forEach(task => {
        if (task.level) levels.add(task.level);
      });
    }
    return Array.from(levels).sort();
  };

  // Handle level selection for vocab - go directly to flashcards
  const handleLevelSelect = (category, level) => {
    // Find the task with this level
    const task = category.tasks?.find(t => t.level === level);
    if (task) {
      // Pass as a task directly (with type set) to go straight to lesson
      onSelectSection({
        ...task,
        id: task.id,
        title: `${category.title} - ${level}`,
        type: 'VOCAB'
      });
    }
  };

  return (
    <>
      <title>{hub.title} - Skill Training Hub</title>
      <meta name="description" content={hub.description} />
      <div className="hub-container">
      <header className="hub-header">
        <div className="hub-badge" style={{textTransform: 'capitalize'}}>{hub.title}</div>
      </header>

      <div className="hub-hero">
        <h1>{hub.title}</h1>
        <p>{hub.description}</p>
      </div>

<div className="hub-sections">
  {(categories || []).map(cat => {
    const Icon = icons[cat.id] || Trophy;
    const availableLevels = getCategoryLevels(cat);
    const showLevels = isVocabLab && availableLevels.length > 0;
    
    return (
      <div 
        key={cat.id} 
        className={`hub-section-card ${showLevels ? 'vocab-level-card' : ''}`}
        onClick={() => onSelectSection && onSelectSection(cat)}
        style={{ cursor: 'pointer' }}
      >
        <div className="section-icon-wrapper">
          <Icon size={24} color="var(--lab-indigo)" />
        </div>
        <div className="section-info">
          <h3>{cat.title}</h3>
          <p>{cat.description}</p>
          
          {/* Level selection buttons for Vocab Lab - goes directly to flashcards */}
          {showLevels && (
            <div className="vocab-level-buttons">
              {availableLevels.map(level => (
                <button 
                  key={level}
                  className={`vocab-level-btn ${level.toLowerCase()}`}
                  onClick={() => handleLevelSelect(cat, level)}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>


     </div>
    </>
  );
};

export default SkillHub;
