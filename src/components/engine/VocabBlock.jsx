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
      <div className="vocab-container">
        <div className="vocab-empty">
          <h3>No vocabulary words available</h3>
          <p>This exercise needs a words array to display.</p>
          <button 
            onClick={onComplete}
          >
            Continue
          </button>
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
    <div className="vocab-container">
       
 {/* TOP SECTION - Clinical Metadata */}
  <div className="invictus-vocab-header">
    <div className="invictus-metadata-left">
      <span className="invictus-task-label">
        TERM {currentIndex + 1} OF {words.length}
      </span>
      {level && (
        <span className="invictus-level-badge">
          {level.toUpperCase()}
        </span>
      )}
    </div>
    {data?.isRandomMix && currentWord?._sourceTopic && (
      <div className="invictus-topic-container">
        <span className="invictus-topic-label">DOMAIN</span>
        <span className="invictus-topic-value">{currentWord._sourceTopic.toUpperCase()}</span>
      </div>
    )}
  </div>

  {/* CARD SECTION - High-Focus Centerpiece */}
  <div className="invictus-card-stage" onClick={handleCardClick}>
    <div className={`invictus-flashcard ${flipStage > 0 ? 'is-flipped' : ''}`}>

      {/* FRONT — Primary Term (Inquiry Phase) */}
      {flipStage === 0 && (
        <div className="invictus-card-face">
          <span className="invictus-phase-indicator">DEFINITION INQUIRY</span>
          <h2 className="invictus-term-display">{currentWord.term}</h2>
          <div className="invictus-interaction-hint">
            <span className="material-icons">ICON Touch</span>
            CLICK TO REVEAL PHONETIC & MEANING
          </div>
        </div>
      )}

      {/* BACK 1 — Translation (Recognition Phase) */}
      {flipStage === 1 && (
        <div className="invictus-card-face invictus-face-back">
          <span className="invictus-phase-indicator">LINGUISTIC CONVERSION</span>
          <h3 className="invictus-translation-display">
            {currentWord.hu}
          </h3>
          <div className="invictus-interaction-hint">
            CLICK TO VIEW FULL DEFINITION
          </div>
        </div>
      )}

      {/* BACK 2 — Detailed Definition (Verification Phase) */}
      {flipStage === 2 && (
        <div className="invictus-card-face invictus-face-back">
          <span className="invictus-phase-indicator">SEMANTIC VERIFICATION</span>
          <div className="invictus-definition-scroller">
            <p className="invictus-definition-text">
              {currentWord.definition}
            </p>
            <div className="invictus-example-container">
              <span className="invictus-example-label">CONTEXTUAL USAGE</span>
              <p className="invictus-example-text">"{currentWord.example}"</p>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>

  {/* SRS CONTROLS - Assessment Input */}
  <div className="invictus-srs-panel">
    <div className="invictus-srs-grid">
      <button
        className="invictus-srs-btn invictus-btn-hard"
        onClick={(e) => {
          e.stopPropagation();
          handleDifficulty('hard');
        }}
      >
        <span className="invictus-btn-icon">😫</span>
        <span className="invictus-btn-label">RECALL FAILURE</span>
      </button>
      
      <button
        className="invictus-srs-btn invictus-btn-good"
        onClick={(e) => {
          e.stopPropagation();
          handleDifficulty('good');
        }}
      >
        <span className="invictus-btn-icon">🤔</span>
        <span className="invictus-btn-label">UNCERTAIN</span>
      </button>
      
      <button
        className="invictus-srs-btn invictus-btn-easy"
        onClick={(e) => {
          e.stopPropagation();
          handleDifficulty('easy');
        }}
      >
        <span className="invictus-btn-icon">🧠</span>
        <span className="invictus-btn-label">MASTERED</span>
      </button>
    </div>
  </div>

</div>

  );
};

export default VocabBlock;
