import React, { useState, useMemo, useEffect } from 'react';
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

const GapFillBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false, 
  showPassage = true,
  activeGap: controlledActiveGap,
  onActiveGapChange 
}) => {
  const {
    title = 'Fill in the Blanks',
    instruction,
    passage = '',
    tokens = [],
    answers = [],
    xpReward = 50
  } = data;

  // Track user's selections: { gapIndex: selectedWord } - initialize from userAnswers if provided
  const [selections, setSelections] = useState(() => {
    // Convert userAnswers object to selections format if needed
    if (userAnswers && Object.keys(userAnswers).length > 0) {
      return userAnswers;
    }
    return {};
  });

  // Controlled/uncontrolled active gap state
  const [internalActiveGap, setInternalActiveGap] = useState(null);
  const isControlled = controlledActiveGap !== undefined;
  const activeGap = isControlled ? controlledActiveGap : internalActiveGap;
  const setActiveGap = (value) => {
    if (isControlled) {
      onActiveGapChange?.(value);
    } else {
      setInternalActiveGap(value);
    }
  };

   // Sync selections when userAnswers changes from parent (e.g., restoring saved progress)
   useEffect(() => {
     if (userAnswers && Object.keys(userAnswers).length > 0) {
       setSelections(prev => {
         // Only update if different to avoid unnecessary re-renders
         const needsUpdate = Object.keys(userAnswers).some(
           key => userAnswers[key] !== prev[key]
         );
         return needsUpdate ? userAnswers : prev;
       });
     }
   }, [userAnswers]);

  // Ensure passage is a string before using split
  const passageString = typeof passage === 'string' ? passage : '';

  // Parse passage to find gap markers ____(n)____
  const parsePassage = () => {
    const regex = /____\((\d+)\)____/g;
    const parts = passageString.split(regex);
    // parts: [text, gap1Index, text, gap2Index, text, ...]
    return parts;
  };

  const parts = passageString.split(/____\((\d+)\)____/g);

  // Get the list of gap indices from the parsed passage
  const getGapIndices = () => {
    const indices = [];
    const regex = /____\((\d+)\)____/g;
    let match;
    while ((match = regex.exec(passageString)) !== null) {
      indices.push(parseInt(match[1]));
    }
    return indices;
  };



  // Handle token selection - fills the ACTIVE gap only (user must click gap first to select it)
  const handleTokenSelect = (token) => {
    if (isReviewMode) return;

    // MUST have an active gap selected - token does nothing if no gap is active
    if (!activeGap) return;

    const newSelections = { ...selections, [activeGap]: token };
    setSelections(newSelections);
    if (onUpdate) onUpdate(newSelections);
  };

  // Handle gap click to toggle selection and set active gap
  const handleGapClick = (gapIndex) => {
    console.log('GapFillBlock: handleGapClick called with gapIndex:', gapIndex);
    console.log('GapFillBlock: current activeGap:', activeGap);
    console.log('GapFillBlock: current selections:', selections);
    console.log('GapFillBlock: isReviewMode:', isReviewMode);
    
    if (isReviewMode) {
      console.log('GapFillBlock: In review mode, ignoring click');
      return;
    }
    
    // If clicking the already active gap
    if (activeGap === gapIndex) {
      console.log('GapFillBlock: Clicking same active gap');
      // If gap has content, clear it but keep active
      if (selections[gapIndex]) {
        console.log('GapFillBlock: Clearing selection for gap', gapIndex);
        const newSelections = { ...selections };
        delete newSelections[gapIndex];
        setSelections(newSelections);
        if (onUpdate) {
          onUpdate(newSelections);
        }
      } else {
        // Empty and active: deselect
        console.log('GapFillBlock: Deselecting gap (was empty and active)');
        setActiveGap(null);
      }
      return;
    }
    
    // Different gap clicked: set as active
    console.log('GapFillBlock: Setting new active gap:', gapIndex);
    setActiveGap(gapIndex);
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
    const isActive = activeGap === gapIndex;
    const userAnswer = selections[gapIndex];
    const correctAnswer = answers[gapIndex - 1];
    
    if (!isReviewMode) {
      if (isActive) return 'active';
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

      {/* Passage with gaps - only show if showPassage is true */}
      {showPassage && (
      <div className="gap-fill-passage">
        {parts.map((part, index) => {
          // Even indices are text, odd indices are gap numbers
          if (index % 2 === 0) {
            return <span key={index} className="passage-text">{part}</span>;
          }
          
          const gapIndex = parseInt(part);
          const gapStyle = getGapStyle(gapIndex);
          const userAnswer = selections[gapIndex];
          
          console.log(`GapFillBlock: Rendering gap index ${gapIndex}, style: ${gapStyle}, hasAnswer: ${!!userAnswer}, isActive: ${activeGap === gapIndex}`);
          
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
      )}

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

