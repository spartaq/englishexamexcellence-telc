import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '../../store/useExamStore';
import './VocabBlock.css';

const VocabBlock = ({ data, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipStage, setFlipStage] = useState(0);
  const updateVocabMastery = useExamStore(state => state.updateVocabMastery);

  // Safety check for missing words array
  const words = data?.words || [];
  const currentWord = words[currentIndex];
  
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
       
      {/* TOP SECTION */}
      <div className="vocab-top-section">
        <span className="task-label">
          {currentIndex + 1} of {words.length} Terms
        </span>
      </div>

      {/* CARD SECTION */}
      <div className="card-scene" onClick={handleCardClick}>
        <div className={`vocab-card ${flipStage > 0 ? 'is-flipped' : ''}`}>

          {/* FRONT — English term */}
          {flipStage === 0 && (
            <div className="card-face">
              <h2 className="term-text">{currentWord.term}</h2>
              <p className="hint-text">
                Tap to reveal meaning
              </p>
            </div>
          )}

          {/* BACK 1 — Hungarian translation */}
          {flipStage === 1 && (
            <div className="card-face card-face-back">
              <h3 className="translation-text">
                {currentWord.hu}
              </h3>
              <p className="hint-text">
                Tap to see definition
              </p>
            </div>
          )}

          {/* BACK 2 — Definition + example */}
          {flipStage === 2 && (
            <div className="card-face card-face-back">
              <p className="definition-text">
                {currentWord.definition}
              </p>
              <div className="example-box">
                "{currentWord.example}"
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SRS CONTROLS - Now always visible */}
      <div className="srs-controls-wrapper">
        <div className="srs-controls">
          <button
            className="srs-btn btn-hard"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card from flipping when clicking button
              handleDifficulty('hard');
            }}
          >
            Don't know it
          </button>
          <button
            className="srs-btn btn-good"
            onClick={(e) => {
              e.stopPropagation();
              handleDifficulty('good');
            }}
          >
            Not Sure
          </button>
          <button
            className="srs-btn btn-easy"
            onClick={(e) => {
              e.stopPropagation();
              handleDifficulty('easy');
            }}
          >
            Know it
          </button>
        </div>
      </div>

    </div>
  );
};

export default VocabBlock;