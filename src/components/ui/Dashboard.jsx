import React from 'react';
import { Award, BookOpen, Zap, Library } from 'lucide-react';
import XPBadge from '../gamified/XPBadge'; // Adjusted path based on your tree
import './dashboard.css';

const Dashboard = ({ 
  isPremium, 
  onSelectTest, 
  onSelectModule, 
  TEST_PLATFORM_CONFIG, 
  EXTRA_TOOLS 
}) => {
  return (
    <div className="dashboard-wrapper">
      
      {/* CHAPTER 1: THE TEACHER'S WELCOME */}
      <header className="dashboard-hero">
        <div className="dashboard-hero-content">
          <h1>
            {isPremium ? "Ready for today's session? ??" : "Let's get to work. ??"}
          </h1>
          <p>
            {isPremium 
              ? "Your training plan is ready. Remember: 15 minutes of focused work is better than 3 hours of aimless practice." 
              : "Welcome to the Lab. Pick your target exam below and we'll start breaking it down into manageable atoms."}
          </p>
          
          {/* Quick Effort Summary */}
          <div className="xp-badge-container">
            <XPBadge mode="total" />
          </div>
        </div>
        <Award size={200} className="dashboard-hero-icon" />
      </header>

      {/* CHAPTER 2: THE QUALIFICATIONS (Exam Hubs) */}
      <div className="dashboard-section-header">
        <h2>Choose Your Target</h2>
        <p>Select to take a full mock exam.</p>
      </div>

      <div className="exam-selection-grid">
        {Object.values(TEST_PLATFORM_CONFIG).map(test => (
          <div 
            key={test.id} 
            className="exam-card" 
            onClick={() => onSelectTest(test.id)} 
          >
            <div 
              className="exam-card-icon"
              style={{ background: test.color }}
            >
              <BookOpen size={28} />
            </div>
            <h3>{test.title}</h3>
            <p>{test.description}</p>
          </div>
        ))}
      </div>

      {/* CHAPTER 3: DAILY MUSCLE BUILDING (Skills) */}
      <div className="dashboard-section-header">
        <h2>Build Your Muscles</h2>
        <p>Focus on a specific skill atom today.</p>
      </div>

      <div className="extra-tools-grid">
        {EXTRA_TOOLS.map(tool => (
          <div 
            key={tool.id} 
            className="exam-card" 
            onClick={() => onSelectModule(tool.hubKey)} 
          >
            <div 
              className="exam-card-icon"
              style={{ background: tool.color }}
            >
              {tool.icon}
            </div>
            <div>
              <h4>{tool.title}</h4>
              <p>{tool.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;