import React from 'react';
import { Zap, Clock, BookOpen, Headset, PenTool, Mic, Info, List, Shuffle, Timer, Library, GraduationCap } from 'lucide-react';
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
            className="invictus-info-btn" 
            onClick={onShowDescription}
            title="Learn about the exam format"
          >
            <Info size={24} color="white" />
          </button>
        </div>
      </header>

      {/* MAIN PATH GRID: Full Mock Exams + Daily Skill Training */}
      <div className="path-grid">
        {/* FULL MOCK CARD */}
        <div className="strategy-card highlight">
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

        {/* ATOMS CARD */}
        <div className="strategy-card highlight">
          <Zap size={40} color="var(--invictus-red)" />
          <h3>Daily Skill Training</h3>
          <p>
            <strong>Quick Practice.</strong> A single random exercise at a time - reading, listening, speaking, writing, or vocab.
          </p>
          
          <button 
            onClick={() => onSelectPath('ielts-mini-random-general')}
            className="btn-base btn-primary" 
            style={{ marginBottom: '12px' }}
          >
            <Shuffle size={18} style={{ marginRight: '8px' }} />
            Start General Random Exercise
          </button>
          
          <button 
            onClick={() => onSelectPath('ielts-mini-random-academic')}
            className="btn-base btn-primary" 
            style={{ marginBottom: '12px' }}
          >
            <BookOpen size={18} style={{ marginRight: '8px' }} />
            Start Academic Random Exercise
          </button>
          
          <Link 
            to="/dashboard/ielts-mini-individual"
            className="btn-base btn-outline"
            style={{ marginBottom: '12px', display: 'inline-block', textDecoration: 'none' }}
          >
            <List size={16} style={{ marginRight: '8px' }} />
            Individual Skill Tests
          </Link>
        </div>
      </div>

      {/* DAILY MUSCLE BUILDING SECTION */}
      <div className="brandtest-section-header">
        <h2>Daily Muscle Building</h2>
        <p>Build your skills with quick daily practice.</p>
      </div>

      <div className="extra-tools-grid">
        {/* Quick Test Part Card */}
        <div 
          className="strategy-card standard" 
          onClick={() => onSelectPath('ielts-mini-random-general')}
          style={{ cursor: 'pointer' }}
        >
          <Timer size={40} color="var(--invictus-red)" />
          <h3>Quick Test Part</h3>
          <p>
            <strong>5-10 Minutes.</strong> Practice a random part of the exam - reading, listening, speaking, or writing.
          </p>
          <button className="btn-base btn-primary">
            <Zap size={18} style={{ marginRight: '8px' }} />
            Start Quick Test
          </button>
        </div>

        {/* 5 Min Vocab Card */}
        <div 
          className="strategy-card standard" 
          onClick={() => onSelectPath('vocabulary')}
          style={{ cursor: 'pointer' }}
        >
          <Library size={40} color="#8b5cf6" />
          <h3>5 Min Vocab</h3>
          <p>
            <strong>Build Word Power.</strong> Master academic and topical vocabulary in just 5 minutes a day.
          </p>
          <button className="btn-base btn-primary" style={{ background: '#8b5cf6' }}>
            <BookOpen size={18} style={{ marginRight: '8px' }} />
            Start Vocab
          </button>
        </div>

        {/* Daily Grammar Drill Card */}
        <div 
          className="strategy-card standard" 
          onClick={() => onSelectPath('drillshub')}
          style={{ cursor: 'pointer' }}
        >
          <GraduationCap size={40} color="#f59e0b" />
          <h3>Daily Grammar Drill</h3>
          <p>
            <strong>Sharpen Your Grammar.</strong> Practice punctuation, sentence structure, and core grammar rules.
          </p>
          <button className="btn-base btn-primary" style={{ background: '#f59e0b' }}>
            <Zap size={18} style={{ marginRight: '8px' }} />
            Start Drill
          </button>
        </div>
      </div>
     </div>
    </>
  );
};

export default BrandTestHub;
