import React from 'react';
import { Zap, Clock, BookOpen, Headset, PenTool, Mic, Info, List, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './BrandTestHub.css';

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
    <>
      <title>{activeTest.title} Hub - Training & Practice</title>
      <meta name="description" content={`Choose your training mode for ${activeTest.title}. Build skills daily with Atoms or test your stamina with full mock exams.`} />
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
            <strong>The "Atom" Method.</strong> All parts of the test but only one part per skill for more manageable practice.
          </p>
          
          <Link 
            to="/dashboard/ielts-general-mini-test"
            className="btn-base btn-primary" 
            style={{ marginBottom: '12px', display: 'inline-block', textDecoration: 'none' }}
          >
            <Shuffle size={18} style={{ marginRight: '8px' }} />
            Take General Mini Test
          </Link>
          
          <Link 
            to="/dashboard/ielts-academic-mini-test"
            className="btn-base btn-primary" 
            style={{ marginBottom: '12px', display: 'inline-block', textDecoration: 'none' }}
          >
            <BookOpen size={18} style={{ marginRight: '8px' }} />
            Take Academic Mini Test
          </Link>
          
          <Link 
            to="/dashboard/ielts-mini-individual"
            className="btn-base btn-outline"
          >
            <List size={16} style={{ marginRight: '8px' }} />
            Individual Skill Tests (Mini)
          </Link>
        </div>

        {/* FULL MOCK CARD */}
        <div className="strategy-card standard">
          <Clock size={40} color="#64748b" />
          <h3>Full Mock Exams</h3>
          <p>
            <strong>The Marathon.</strong> Test your stamina with a complete exam simulation.
            Use once a week to track your progress.
          </p>
          
          {/* IELTS has General and Academic options */}
          {activeTest.id === 'ielts' ? (
            <>
              <Link 
                to="/dashboard/ielts-general-full-test"
                className="btn-base btn-primary" 
                style={{ marginBottom: '12px', display: 'inline-block', textDecoration: 'none' }}
              >
                <Shuffle size={18} style={{ marginRight: '8px' }} />
                Take General Mock
              </Link>
              
              <Link 
                to="/dashboard/ielts-academic-full-test"
                className="btn-base btn-primary" 
                style={{ marginBottom: '12px', display: 'inline-block', textDecoration: 'none' }}
              >
                <BookOpen size={18} style={{ marginRight: '8px' }} />
                Take Academic Mock
              </Link>
            </>
          ) : (
            <button 
              className="btn-base btn-primary" 
              onClick={() => onSelectPath('random-mock')}
              style={{ marginBottom: '12px' }}
            >
              <Shuffle size={18} style={{ marginRight: '8px' }} />
              Take Random Mock
            </button>
          )}
          
          <button 
            className="btn-base btn-outline"
            onClick={() => onSelectPath('mocks')}
          >
            <List size={16} style={{ marginRight: '8px' }} />
            Individual Skill Tests (Full)
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
    </>
  );
};

export default BrandTestHub;
