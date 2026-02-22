import React from 'react';
import { Zap, Clock, BookOpen, Headset, PenTool, Mic, Info, List, Shuffle } from 'lucide-react';
import './ExamStrategy.css';

/**
 * BrandTestHub - The main hub for a test brand (e.g., IELTS)
 * 
 * Shows 2 main cards:
 * 1. Atoms Card - Quick skill practice with mini-test and skill options
 * 2. Full Mock Card - Take a random mock or view all mocks
 * 
 * TODO (Premium Features):
 * - Track completed mocks for premium users
 * - Show progress indicators on mock card
 * - Remember partially completed mocks
 */
const BrandTestHub = ({ activeTest, onSelectPath, onShowDescription }) => {

  return (
    <div className="strategy-container">
      
      <header className="strategy-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>{activeTest.title}</h1>
            <p>
              Choose your training mode. Build skills daily with Atoms, or test your stamina with full mocks.
            </p>
          </div>
          <button 
            className="btn-icon-only" 
            onClick={onShowDescription}
            title="Learn about the exam format"
            style={{ 
              background: 'var(--lab-indigo)', 
              border: 'none', 
              borderRadius: '50%',
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            <Info size={24} color="white" />
          </button>
        </div>
      </header>

      <div className="path-grid">
        {/* ATOMS CARD */}
        <div className="strategy-card highlight">
          <Zap size={40} color="#2563eb" />
          <h3>Daily Skill Training</h3>
          <p>
            <strong>The "Atom" Method.</strong> Quick, focused practice sessions. 
            Take a random mini-test or practice specific skills.
          </p>
          
          <button 
            className="btn-base btn-primary" 
            onClick={() => onSelectPath('mini-test')}
            style={{ marginBottom: '12px' }}
          >
            <Shuffle size={18} style={{ marginRight: '8px' }} />
            Take General Mini Test
          </button>
          
          <button 
            className="btn-base btn-primary" 
            onClick={() => onSelectPath('academic-flow')}
            style={{ marginBottom: '12px' }}
          >
            <BookOpen size={18} style={{ marginRight: '8px' }} />
            Take Academic Mini Test
          </button>
          
          <button 
            className="btn-base btn-outline"
            onClick={() => onSelectPath('skill-tests')}
          >
            <List size={16} style={{ marginRight: '8px' }} />
            View Skill Tests
          </button>
        </div>

        {/* FULL MOCK CARD */}
        <div className="strategy-card standard">
          <Clock size={40} color="#64748b" />
          <h3>Full Mock Exams</h3>
          <p>
            <strong>The Marathon.</strong> Test your stamina with a complete exam simulation.
            Use once a week to track your progress.
          </p>
          
          <button 
            className="btn-base btn-primary" 
            onClick={() => onSelectPath('random-mock')}
            style={{ marginBottom: '12px' }}
          >
            <Shuffle size={18} style={{ marginRight: '8px' }} />
            Take Random Mock
          </button>
          
          <button 
            className="btn-base btn-outline"
            onClick={() => onSelectPath('mocks')}
          >
            <List size={16} style={{ marginRight: '8px' }} />
            View All Mocks
          </button>
          
          {/* TODO: Premium feature - show completion status
          {isPremium && (
            <div className="mock-progress">
              <span>Completed: 3/5 mocks</span>
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
};

export default BrandTestHub;
