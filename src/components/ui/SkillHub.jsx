import React from 'react';
import { ArrowLeft, Trophy, Dumbbell, ChevronRight } from 'lucide-react';
import './hub.css';

const icons = { 'mock-tests': Trophy, 'skill-drills': Dumbbell };

const SkillHub = ({ data, onBack, onSelectSection, backButtonText = 'Back' }) => {
  // Use the passed data prop directly
  const hub = data;

  if (!hub) return <div style={{padding: '40px'}}>Hub data coming soon!</div>;

  // Safety check: ensure categories is an array
  const categories = hub.categories || [];

  return (
    <>
      <title>{hub.title} - Skill Training Hub</title>
      <meta name="description" content={hub.description} />
      <div className="hub-container">
      <header className="hub-header">
        <button 
          onClick={onBack} 
          className="btn-back-link" 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={20} /> {backButtonText}
        </button>
        <div className="hub-badge" style={{textTransform: 'capitalize'}}>{hub.title}</div>
      </header>

      <div className="hub-hero">
        <h1>{hub.title}</h1>
        <p>{hub.description}</p>
      </div>

  <div className="hub-sections">
  {/* Add ?. and || [] to handle cases where categories might be missing during development */}
  {(categories || []).map(cat => {
    const Icon = icons[cat.id] || Trophy;
    return (
      <div key={cat.id} className="hub-section-card" onClick={() => onSelectSection(cat)}>
        <div className="section-icon-wrapper">
          <Icon size={24} color="var(--lab-indigo)" />
        </div>
        <div className="section-info">
          <h3>{cat.title}</h3>
          <p>{cat.description}</p>
        </div>
        <ChevronRight size={20} color="var(--border-color)" />
      </div>
    );
  })}
</div>


     </div>
    </>
  );
};

export default SkillHub;