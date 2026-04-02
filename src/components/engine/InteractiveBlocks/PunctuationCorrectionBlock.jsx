import React, { useState } from 'react';
import { Zap, Info, CheckCircle, XCircle } from 'lucide-react';
import './PunctuationCorrectionBlock.css';

/**
 * PunctuationCorrectionBlock - Interactive drill for adding punctuation
 * 
 * Users click between words to toggle punctuation marks (commas, etc.)
 * Currently supports "Add Mode" - sentences have no punctuation, user adds where needed
 * 
 * Data structure:
 * {
 *   id: 'comma-drill-1',
 *   type: 'punctuation-correction',
 *   title: 'Comma Usage',
 *   instruction: 'Click between words to add commas where needed.',
 *   xpReward: 100,
 *   punctuationMark: ',', // default comma
 *   sentences: [
 *     {
 *       id: 's1',
 *       text: 'However the results were inconclusive.',
 *       correctPositions: [0], // positions after word index where comma belongs
 *       explanation: 'Use a comma after introductory words like "however".'
 *     }
 *   ]
 * }
 */
const PunctuationCorrectionBlock = ({ data, onUpdate, isReviewMode = false }) => {
  const { 
    title = "Punctuation Drill", 
    instruction, 
    xpReward = 100, 
    sentences = [],
    punctuationMark = ','
  } = data;

  // Track user's comma placements for each sentence
  // Format: { sentenceId: Set<position> }
  const [placements, setPlacements] = useState({});

  // Call onUpdate when placements change from user interaction
  const handlePlacementsChange = (newPlacements) => {
    if (!onUpdate) return;
    const serializable = {};
    Object.keys(newPlacements).forEach(k => {
      serializable[k] = Array.from(newPlacements[k]);
    });
    onUpdate(serializable);
  };

  // Toggle comma at position for a specific sentence
  const togglePunctuation = (sentenceId, position) => {
    if (isReviewMode) return;
    
    setPlacements(prev => {
      const current = prev[sentenceId] || new Set();
      const newSet = new Set(current);
      
      if (newSet.has(position)) {
        newSet.delete(position);
      } else {
        newSet.add(position);
      }
      
      const newPlacements = { ...prev, [sentenceId]: newSet };
      // Notify parent of change
      handlePlacementsChange(newPlacements);
      return newPlacements;
    });
  };

  // Calculate results for review
  const calculateResults = () => {
    let totalCorrect = 0;
    let totalUserPlacements = 0;
    let totalExpected = 0;
    const sentenceResults = {};

    sentences.forEach(sentence => {
      const userPositions = placements[sentence.id] || new Set();
      const expectedPositions = new Set(sentence.correctPositions || []);
      
      const correct = [...userPositions].filter(pos => expectedPositions.has(pos));
      const missed = [...expectedPositions].filter(pos => !userPositions.has(pos));
      const extra = [...userPositions].filter(pos => !expectedPositions.has(pos));
      
      totalCorrect += correct.length;
      totalUserPlacements += userPositions.size;
      totalExpected += expectedPositions.size;
      
      sentenceResults[sentence.id] = {
        correct: correct.length,
        missed: missed.length,
        extra: extra.length,
        isPerfect: correct.length === expectedPositions.size && extra.length === 0
      };
    });

    return {
      totalCorrect,
      totalUserPlacements,
      totalExpected,
      sentenceResults,
      accuracy: totalExpected > 0 ? Math.round((totalCorrect / totalExpected) * 100) : 0
    };
  };

  // Render a single sentence with clickable gaps
  const renderSentence = (sentence, sentenceIndex) => {
    const words = sentence.text.split(/\s+/);
    const userPositions = placements[sentence.id] || new Set();
    const expectedPositions = isReviewMode ? new Set(sentence.correctPositions || []) : null;
    
    return (
      <div 
        key={sentence.id} 
        className="punctuation-sentence-container"
      >
        {/* Sentence number */}
        <div className="punctuation-sentence-number">
          {sentenceIndex + 1}
        </div>
        
        {/* Interactive sentence */}
        <div className="punctuation-interactive-sentence">
          {words.map((word, wordIndex) => {
            // Position = wordIndex means "after this word"
            const position = wordIndex;
            const hasUserComma = userPositions.has(position);
            const hasExpectedComma = expectedPositions?.has(position);
            
            // Determine gap styling based on state
            let gapClassName = 'punctuation-gap';
            if (isReviewMode) {
              if (hasUserComma && hasExpectedComma) gapClassName += ' review-correct';
              else if (hasUserComma && !hasExpectedComma) gapClassName += ' review-incorrect';
              else if (!hasUserComma && hasExpectedComma) gapClassName += ' review-missed';
              else gapClassName += ' review-neutral';
            } else {
              if (hasUserComma) gapClassName += ' user-comma';
            }

            return (
              <React.Fragment key={wordIndex}>
                {/* The word itself */}
                <span className="punctuation-word">
                  {word}
                </span>
                
                {/* Clickable gap AFTER word (not after last word) */}
                {wordIndex < words.length - 1 && (
                  <span 
                    className={gapClassName}
                    role="button"
                    tabIndex={isReviewMode ? -1 : 0}
                    onClick={() => togglePunctuation(sentence.id, position)}
                    onKeyDown={(e) => {
                      if (!isReviewMode && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
                        e.preventDefault();
                        togglePunctuation(sentence.id, position);
                      }
                    }}
                    title={isReviewMode ? '' : 'Click to add/remove comma'}
                  >
                    {hasUserComma ? (
                      <span className="punctuation-comma-mark">{punctuationMark}</span>
                    ) : isReviewMode && hasExpectedComma ? (
                      <span className="punctuation-comma-mark missed">{punctuationMark}</span>
                    ) : null}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Explanation in review mode */}
        {isReviewMode && sentence.explanation && (
          <div className="punctuation-explanation">
            <span className="punctuation-explanation-tip">💡 Tip:</span> {sentence.explanation}
          </div>
        )}
      </div>
    );
  };

  const results = isReviewMode ? calculateResults() : null;

  return (
    <div className="punctuation-correction-block">
      {/* HEADER: Title & XP Reward */}
      <div className="punctuation-header">
        <h3 className="punctuation-title">
          {title}
        </h3>
        <div className="punctuation-xp">
          <Zap size={14} fill="#d97706" /> {xpReward} XP
        </div>
      </div>

      {/* INSTRUCTION */}
      <div className="punctuation-instruction">
        <Info size={18} className="punctuation-instruction-icon" />
        <p className="punctuation-instruction-text">
          {instruction || `Click between words to add ${punctuationMark === ',' ? 'commas' : punctuationMark} where needed.`}
        </p>
      </div>

      {/* SENTENCES */}
      <div className="punctuation-sentences-container">
        {sentences.map((sentence, index) => renderSentence(sentence, index))}
      </div>

      {/* Results summary - shown in review mode */}
      {isReviewMode && (
        <>
          {/* Results Summary */}
          <div className="punctuation-results-summary">
            <div className="punctuation-results-item">
              <div className="punctuation-results-color correct" /> 
              <span className="punctuation-results-label">Correct</span>
            </div>
            <div className="punctuation-results-item">
              <div className="punctuation-results-color extra" /> 
              <span className="punctuation-results-label">Extra</span>
            </div>
            <div className="punctuation-results-item">
              <div className="punctuation-results-color missed" /> 
              <span className="punctuation-results-label">Missed</span>
            </div>
          </div>

          {/* Score Display */}
          <div className={`punctuation-score-display ${results.accuracy === 100 ? 'perfect' : ''}`}>
            {results.accuracy === 100 ? (
              <>
                <CheckCircle size={24} className="punctuation-score-icon" />
                <span className="punctuation-score-text">
                  Perfect! All commas placed correctly!
                </span>
              </>
            ) : (
              <>
                <span className="punctuation-score-text normal">
                  Score: {results.totalCorrect}/{results.totalExpected} correct ({results.accuracy}%)
                </span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PunctuationCorrectionBlock;

