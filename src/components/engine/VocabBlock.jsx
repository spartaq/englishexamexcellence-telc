import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '../../store/useExamStore';
import './VocabBlock.css';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const VocabBlock = ({ 
  data, 
  onComplete 
 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipStage, setFlipStage] = useState(0);
  const updateVocabMastery = useExamStore(state => state.updateVocabMastery);

  const [words, setWords] = useState([]);
  
  // Reset words when data changes
  useEffect(() => {
    const rawWords = data?.words || [];
    const shuffledWords = data?.isRandomMix ? shuffleArray(rawWords) : rawWords;
    setWords(shuffledWords);
    setCurrentIndex(0);
    setFlipStage(0);
  }, [data?.id, data?.isRandomMix, data?.words]);
  
  const currentWord = words[currentIndex];
  
  // Get level from data (each task now has one level)
  const level = data?.level;
  
  // If no words available, show message and allow completion
  if (words.length === 0) {
    return (
      <div className="invictus-vocab-session-layout">
        <div className="vocab-container">
          <div className="vocab-empty">
            <h3>No vocabulary words available</h3>
            <p>This exercise needs a words array to display.</p>
            <button 
              onClick={onComplete} className="invictus-finish-btn"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    if (flipStage < 2) {
      setFlipStage(prev => prev + 1);
    }
  };

  const handleDifficulty = (level) => {
    // 1. Update store
    updateVocabMastery(currentWord.term, level);
    
    // 2. Reset flip stage for the next word
    setFlipStage(0);

    // 3. Small delay for visual feedback before moving to next word
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 300);
  };

  return (
    <div className="invictus-vocab-session-layout">
      {/* MAIN CONTENT AREA */}
      <main className="vocab-main-content">
        <div className="vocab-main-content-inner">
          <div className="content-grid">
            {/* LEFT PANEL: SESSION CONFIGURATION */}
            <section className="session-config">
              <div>
                <h2 className="config-section-title">Session Configuration</h2>
                <div className="config-group">
                  {/* Level Selector */}
                  <div className="config-item">
                    <label className="config-label">Target Proficiency</label>
                    <div className="level-selector">
                      <button className={`level-btn ${level === 'B2' ? 'active' : ''}`}>
                        B2 UPPER
                      </button>
                      <button className={`level-btn ${level === 'C1' ? 'active' : ''}`}>
                        C1 ADVANCED
                      </button>
                    </div>
                  </div>

                  {/* Topic Dropdown */}
                  <div className="config-item">
                    <label className="config-label">Subject Domain</label>
                    <select className="topic-select">
                      <option>Environment</option>
                      <option>Technology</option>
                      <option>Society</option>
                      <option>Medicine</option>
                    </select>
                  </div>

                  {/* Word Count Slider */}
                  <div className="config-item">
                    <div className="slider-header">
                      <label className="config-label">Lexical Volume</label>
                      <span className="slider-value">{words.length} Words</span>
                    </div>
                    <input 
                      type="range" 
                      className="word-slider"
                      min="15" 
                      max="100" 
                      value={words.length}
                      readOnly
                    />
                    <div className="slider-labels">
                      <span>15</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  <button className="start-session-btn">
                    Start Session
                  </button>
                </div>
              </div>

              <div className="protocol-section">
                <div className="protocol-header">
                  <span className="protocol-dot"></span>
                  <span className="protocol-label">Active Protocol</span>
                </div>
                <p className="protocol-text">
                  Spaced Repetition System (SRS) enabled. Your feedback directly influences the algorithmic latency of future word presentations.
                </p>
              </div>
            </section>

            {/* CENTER PANEL: FLASHCARD ENVIRONMENT */}
            <section className="flashcard-section">
              {/* Metadata Header */}
              <div className="flashcard-header">
                <div className="header-left">
                  <span className="header-label">Current Item</span>
                  <span className="header-value">
                    WORD {currentIndex + 1} <span className="light">OF</span> {words.length}
                  </span>
                </div>
                <div className="header-right">
                  <span className="header-label">Session Timer</span>
                  <span className="timer-display">12:44.02</span>
                </div>
              </div>

              {/* The Flashcard */}
              <div className="flashcard-container" onClick={handleCardClick}>
                {/* Clinical Grid Sub-texture */}
                <div className="grid-texture"></div>
                
                <div className="flashcard-content">
                  <h1 className="flashcard-term">{currentWord.term}</h1>
                  <div className="flashcard-divider"></div>
                  <p className="flashcard-hint">
                    Click to reveal clinical definition and usage examples.
                  </p>
                </div>

                {/* Card Accents */}
                <div className="card-accent-top">ID: INV-294-B</div>
                <div className="card-accent-bottom">
                  <div className="accent-dot"></div>
                  <div className="accent-dot"></div>
                  <div className="accent-dot"></div>
                </div>
              </div>

              {/* SRS Controls */}
              <div className="srs-controls">
                <button
                  className="srs-btn recall-failure"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficulty('hard');
                  }}
                >
                  <span className="material-symbols-outlined srs-icon">cancel</span>
                  <span className="srs-label">Recall Failure</span>
                  <span className="srs-review-time">Review in 1m</span>
                </button>
                
                <button
                  className="srs-btn uncertain"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficulty('good');
                  }}
                >
                  <span className="material-symbols-outlined srs-icon">question_mark</span>
                  <span className="srs-label">Uncertain</span>
                  <span className="srs-review-time">Review in 10m</span>
                </button>
                
                <button
                  className="srs-btn mastered"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficulty('easy');
                  }}
                >
                  <span className="material-symbols-outlined srs-icon">verified</span>
                  <span className="srs-label">Mastered</span>
                  <span className="srs-review-time">Review in 4d</span>
                </button>
              </div>

              {/* Keyboard Shortcuts Footer */}
              <div className="keyboard-shortcuts">
                <kbd className="kbd">SPACE</kbd>
                <span className="shortcut-label">to reveal answer</span>
                <span className="shortcut-divider">|</span>
                <kbd className="kbd">1 - 3</kbd>
                <span className="shortcut-label">to log results</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default VocabBlock;
