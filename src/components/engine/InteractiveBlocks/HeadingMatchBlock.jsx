import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './HeadingMatchBlock.css';

const HeadingMatchBlock = ({ data, userAnswers = {}, onUpdate, isReviewMode = false }) => {
  const questions = data.questions || [];
  const headings = data.headings || [];

  // Helper to format heading label - support both "a Clear proof" and "1. Clear proof" formats
  const getHeadingLabel = (heading, idx) => {
    // Check if heading already starts with a letter prefix like "a Clear proof"
    const letterMatch = heading.match(/^([a-z])\s+(.+)/i);
    if (letterMatch) {
      return `${letterMatch[1].toLowerCase()}. ${letterMatch[2]}`;
    }
    // Check if heading starts with number prefix like "1. Clear proof"
    const numMatch = heading.match(/^(\d+)\s*\.\s*(.+)/);
    if (numMatch) {
      return `${numMatch[1]}. ${numMatch[2]}`;
    }
    // Default to numeric label
    return `${idx + 1}. ${heading}`;
  };

  const handleSelect = (qId, value) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(qId, value);
  };

  return (
    <div className="heading-match-container">
      {/* Instruction Box */}
      {data.instruction && (
        <div className="hm-instruction">
          {data.instruction}
        </div>
      )}
      
      {/* Headings List */}
      {headings.length > 0 && (
        <div className="hm-headings-list">
          <h4 className="hm-headings-title">
            List of Headings
          </h4>
          <div className="hm-flex-col">
            {headings.map((heading, idx) => (
              <div key={idx} className="hm-heading-item">
                {getHeadingLabel(heading, idx)}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Row Header - only show if no instruction, or show a generic prompt */}
      <div className="hm-row-header">
        <span>{data.instruction ? 'Select your answers' : 'Match to Heading'}</span>
        {isReviewMode && <span className="hm-review-mode">Review Mode</span>}
      </div>
      
      {questions.map((q) => {
        const userChoice = userAnswers[q.id];
        const correctChoice = q.answer;
        const isCorrect = isReviewMode && userChoice == correctChoice;
        const isIncorrect = isReviewMode && userChoice !== undefined && userChoice != correctChoice;
        const isMissing = isReviewMode && userChoice === undefined;

        return (
          <div 
            key={q.id} 
            className={`question-card ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isReviewMode ? 'review' : ''}`}
          >
            <h3 className="hm-question">
              <span className="question-label">{String(q.id).replace(/^q/, '')}.</span>
              {q.text}
              {isReviewMode && (
                <span className="status-icon">
                  {isCorrect ? <CheckCircle size={18} color="#10b981" /> : 
                   isIncorrect ? <XCircle size={18} color="#ef4444" /> : null}
                </span>
              )}
            </h3>
            
            <div className="select-wrapper">
              <select 
                className={`answer-input ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                value={userAnswers[q.id] || ""}
                disabled={isReviewMode}
                onChange={(e) => handleSelect(q.id, e.target.value)}
              >
                <option value="" disabled>Select Heading...</option>
                {headings.map((heading, idx) => (
                  <option key={idx} value={idx}>
                    {getHeadingLabel(heading, idx)}
                  </option>
                ))}
              </select>

              {isIncorrect || isMissing ? (
                correctChoice !== undefined ? (
                  <div className="correct-answer-hint">
                  </div>
                ) : null
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeadingMatchBlock;
