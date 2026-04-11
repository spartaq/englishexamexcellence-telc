import React from 'react';
import { ATOM_HUB } from '../../data/TELC/atoms';
import './hub.css';

const AtomHubScreen = ({ onBack, onSelectTask }) => {
  if (!ATOM_HUB) return null;

  return (
    <div className="hub-container">
      <header className="hub-header">
        <button onClick={onBack} className="btn-back-link">
          ← Back
        </button>
        <h1>{ATOM_HUB.title}</h1>
      </header>

      <div className="hub-content">
        {ATOM_HUB.categories.map((category) => (
          <div key={category.id} className="hub-category">
            <div className="category-header">
              <h2>{category.title}</h2>
              <p>{category.description}</p>
            </div>
            
            <button
              className="task-card"
              onClick={() => onSelectTask({
                ...category,
                xp: category.xp || 300
              })}
            >
              <div className="task-info">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
              <div className="task-xp">
                <span>Start</span>
                <span className="xp-badge">+{category.xp || 300} XP</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtomHubScreen;
