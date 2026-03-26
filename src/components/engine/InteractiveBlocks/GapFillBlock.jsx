import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './GapFillBlock.css';

/**
 * GapFillBlock - Traditional gap fill exercise
 * 
 * Shows a text with gap lines/spaces where users select words from a token bank below.
 * Different from SentenceCompleteBlock which uses clickable gaps in text.
 * 
 * Data structure:
 * {
 *   id: 'gap-fill-1',
 *   type: 'gap-fill',
 *   title: 'Fill in the Blanks',
 *   instruction: 'Complete the passage by selecting the correct words.',
 *   xpReward: 50,
 *   passage: 'The text with ____(1)____ gaps and ____(2)____ words to fill.',
 *   tokens: ['word1', 'word2', 'word3', 'distractor1', 'distractor2'],
 *   answers: ['word1', 'word2'], // correct answers in order
 *   distractors: ['distractor1', 'distractor2'] // optional, for mixing
 * }
 */

const GapFillBlock = ({ data, onUpdate, isReviewMode = false }) => {
  const {
    title = 'Fill in the Blanks',
    instruction,
    passage = '',
    tokens = [],
    answers = [],
    xpReward = 50
  } = data;

  // Track user's selections: { gapIndex: selectedWord }
  const [selections, setSelections] = useState({});

  // Parse passage to find gap markers ____(n)____
  const parsePassage = () => {
    const regex = /____\((\d+)\)____/g;
    const parts = passage.split(regex);
    // parts: [text, gap1Index, text, gap2Index, text, ...]
    return parts;
  };

  const parts = passage.split(/____\((\d+)\)____/g);

  // Handle token selection - fills first empty gap
  const handleTokenSelect = (token) => {
    if (isReviewMode) return;
    
    // Find first empty gap
    for (let i = 1; i <= answers.length; i++) {
      if (!selections[i]) {
        const newSelections = {
          ...selections,
          [i]: token
        };
        setSelections(newSelections);
        // Sync with parent if onUpdate is provided
        if (onUpdate) {
          onUpdate(newSelections);
        }
        return;
      }
    }
  };

  // Handle gap click to clear selection
  const handleGapClick = (gapIndex) => {
    if (isReviewMode) return;
    
    const newSelections = { ...selections };
    delete newSelections[gapIndex];
    setSelections(newSelections);
    // Sync with parent if onUpdate is provided
    if (onUpdate) {
      onUpdate(newSelections);
    }
  };

  // Shuffle tokens for display (only once on mount)
  const displayTokens = useMemo(() => {
    return [...tokens].sort(() => Math.random() - 0.5);
  }, [tokens]);

  // Calculate results
  const calculateResults = () => {
    let correct = 0;
    const gapResults = {};

    answers.forEach((answer, index) => {
      const gapIndex = index + 1;
      const userAnswer = selections[gapIndex];
      const isCorrect = userAnswer?.toLowerCase() === answer.toLowerCase();
      
      if (isCorrect) correct++;
      
      gapResults[gapIndex] = {
        userAnswer: userAnswer || null,
        correctAnswer: answer,
        isCorrect
      };
    });

    return {
      correct,
      total: answers.length,
      accuracy: Math.round((correct / answers.length) * 100),
      gapResults
    };
  };

  const handleCheck = () => {
    const results = calculateResults();
    if (onComplete) {
      onComplete(results);
    }
  };

  // Determine gap styling based on state
  const getGapStyle = (gapIndex) => {
    const userAnswer = selections[gapIndex];
    const correctAnswer = answers[gapIndex - 1];
    
    if (!isReviewMode) {
      return userAnswer ? 'filled' : 'empty';
    }
    
    if (!userAnswer) return 'missing';
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? 'correct' : 'incorrect';
  };

  return (
    <div className="gap-fill-block">
      {/* Header */}
      <div className="gap-fill-header">
        <h3 className="gap-fill-title">{title}</h3>
        {xpReward > 0 && (
          <span className="gap-fill-xp">+{xpReward} XP</span>
        )}
      </div>

      {/* Instruction */}
      {instruction && (
        <p className="gap-fill-instruction">{instruction}</p>
      )}

      {/* Passage with gaps */}
      <div className="gap-fill-passage">
        {parts.map((part, index) => {
          // Even indices are text, odd indices are gap numbers
          if (index % 2 === 0) {
            return <span key={index} className="passage-text">{part}</span>;
          }
          
          const gapIndex = parseInt(part);
          const gapStyle = getGapStyle(gapIndex);
          const userAnswer = selections[gapIndex];
          
          return (
            <span
              key={index}
              className={`gap-line ${gapStyle}`}
              onClick={() => handleGapClick(gapIndex)}
            >
              {userAnswer || (isReviewMode ? '____' : '▼')}
            </span>
          );
        })}
      </div>

      {/* Token bank */}
      <div className="gap-fill-tokens">
        <p className="tokens-label">Select words to fill the gaps:</p>
        <div className="token-container">
          {displayTokens.map((token, idx) => {
            // Check if token is already used
            const isUsed = Object.values(selections).includes(token);
            
            return (
              <button
                key={idx}
                className={`token-button ${isUsed ? 'used' : ''}`}
                onClick={() => handleTokenSelect(token)}
                disabled={isUsed || isReviewMode}
              >
                {token}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results summary - shown in review mode */}
      {isReviewMode && (
        <div className="results-summary">
          {(() => {
            const results = calculateResults();
            return (
              <>
                <div className={`score-display ${results.accuracy === 100 ? 'perfect' : ''}`}>
                  {results.accuracy === 100 ? (
                    <><CheckCircle size={20} /> Perfect!</>
                  ) : (
                    <>Score: {results.correct}/{results.total} ({results.accuracy}%)</>
                  )}
                </div>
                <div className="results-legend">
                  <span className="legend-item correct">✓ Correct</span>
                  <span className="legend-item incorrect">✗ Incorrect</span>
                  <span className="legend-item missing">○ Missing</span>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default GapFillBlock;

