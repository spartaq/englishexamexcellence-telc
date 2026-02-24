import React, { useState } from 'react';
import { Zap, Info, CheckCircle, XCircle } from 'lucide-react';

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
const PunctuationCorrectionBlock = ({ data, onComplete, isReviewMode = false }) => {
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
      
      return { ...prev, [sentenceId]: newSet };
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
        className="sentence-container"
        style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Sentence number */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          background: '#e0e7ff',
          color: '#4338ca',
          borderRadius: '50%',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginRight: '12px'
        }}>
          {sentenceIndex + 1}
        </div>
        
        {/* Interactive sentence */}
        <div style={{ 
          display: 'inline-flex', 
          flexWrap: 'wrap', 
          alignItems: 'center',
          gap: '2px',
          fontSize: '1.1rem',
          lineHeight: '2.2'
        }}>
          {words.map((word, wordIndex) => {
            // Position = wordIndex means "after this word"
            const position = wordIndex;
            const hasUserComma = userPositions.has(position);
            const hasExpectedComma = expectedPositions?.has(position);
            
            // Determine gap styling based on state
            let gapStyle = {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '24px',
              height: '28px',
              cursor: isReviewMode ? 'default' : 'pointer',
              borderRadius: '4px',
              transition: 'all 0.15s ease',
              position: 'relative',
              margin: '0 2px'
            };

            if (isReviewMode) {
              if (hasUserComma && hasExpectedComma) {
                // Correct placement
                gapStyle.background = '#dcfce7';
                gapStyle.border = '2px solid #22c55e';
              } else if (hasUserComma && !hasExpectedComma) {
                // Wrong placement
                gapStyle.background = '#fee2e2';
                gapStyle.border = '2px solid #ef4444';
              } else if (!hasUserComma && hasExpectedComma) {
                // Missed placement
                gapStyle.background = '#fef9c3';
                gapStyle.border = '2px solid #facc15';
              } else {
                // No comma needed, no comma placed - neutral
                gapStyle.background = 'transparent';
                gapStyle.border = '2px dashed #e2e8f0';
              }
            } else {
              if (hasUserComma) {
                gapStyle.background = '#e0e7ff';
                gapStyle.border = '2px solid #6366f1';
              } else {
                gapStyle.background = 'transparent';
                gapStyle.border = '2px dashed #cbd5e1';
              }
            }

            return (
              <React.Fragment key={wordIndex}>
                {/* The word itself */}
                <span style={{ 
                  padding: '4px 6px',
                  borderRadius: '4px',
                  color: '#1e293b'
                }}>
                  {word}
                </span>
                
                {/* Clickable gap AFTER word (not after last word) */}
                {wordIndex < words.length - 1 && (
                  <span 
                    style={gapStyle}
                    onClick={() => togglePunctuation(sentence.id, position)}
                    title={isReviewMode ? '' : 'Click to add/remove comma'}
                  >
                    {hasUserComma ? (
                      <span style={{ color: '#4338ca', fontWeight: 700 }}>{punctuationMark}</span>
                    ) : isReviewMode && hasExpectedComma ? (
                      <span style={{ color: '#ca8a04', fontWeight: 700 }}>{punctuationMark}</span>
                    ) : null}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Explanation in review mode */}
        {isReviewMode && sentence.explanation && (
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: '#eff6ff',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#1e40af',
            borderLeft: '3px solid #3b82f6'
          }}>
            <strong>💡 Tip:</strong> {sentence.explanation}
          </div>
        )}
      </div>
    );
  };

  const results = isReviewMode ? calculateResults() : null;

  return (
    <div 
      className="punctuation-correction-block"
      style={{
        background: 'white',
        padding: '32px',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* HEADER: Title & XP Reward */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {title}
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: '#fef3c7', 
          color: '#d97706', 
          padding: '6px 12px', 
          borderRadius: '100px', 
          fontSize: '0.85rem', 
          fontWeight: 700 
        }}>
          <Zap size={14} fill="#d97706" /> {xpReward} XP
        </div>
      </div>

      {/* INSTRUCTION */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        background: '#f1f5f9', 
        padding: '14px 18px', 
        borderRadius: '12px', 
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <Info size={18} style={{ color: '#64748b', marginTop: '2px', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>
          {instruction || `Click between words to add ${punctuationMark === ',' ? 'commas' : punctuationMark} where needed.`}
        </p>
      </div>

      {/* SENTENCES */}
      <div className="sentences-container" style={{ marginBottom: '24px' }}>
        {sentences.map((sentence, index) => renderSentence(sentence, index))}
      </div>

      {/* FOOTER ACTIONS */}
      {!isReviewMode ? (
        <button 
          className="btn-primary" 
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '14px', 
            fontSize: '1rem', 
            fontWeight: 700 
          }}
          onClick={() => {
            const results = calculateResults();
            onComplete(results);
          }}
        >
          Check My Answers
        </button>
      ) : (
        <>
          {/* Results Summary */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px', 
            padding: '16px', 
            background: '#f8fafc', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#dcfce7', border: '2px solid #22c55e', borderRadius: '3px' }} /> 
              <span style={{ fontSize: '0.85rem', color: '#374151' }}>Correct</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '3px' }} /> 
              <span style={{ fontSize: '0.85rem', color: '#374151' }}>Extra</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#fef9c3', border: '2px solid #facc15', borderRadius: '3px' }} /> 
              <span style={{ fontSize: '0.85rem', color: '#374151' }}>Missed</span>
            </div>
          </div>

          {/* Score Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
            background: results.accuracy === 100 ? '#dcfce7' : '#f8fafc',
            borderRadius: '12px',
            border: `1px solid ${results.accuracy === 100 ? '#22c55e' : '#e2e8f0'}`
          }}>
            {results.accuracy === 100 ? (
              <>
                <CheckCircle size={24} color="#22c55e" />
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803d' }}>
                  Perfect! All commas placed correctly!
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151' }}>
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
