import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './HeadingMatchBlock.css';

const HeadingMatchBlock = ({ data, userAnswers = {}, onUpdate, isReviewMode = false }) => {
  const questions = data.questions || [];
  const headings = data.headings || [];

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {headings.map((heading, idx) => (
              <div key={idx} className="hm-heading-item">
                {idx + 1}. {heading}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="hm-row-header">
        <span>Match Paragraph to Heading</span>
        {isReviewMode && <span style={{ color: 'var(--lab-indigo)' }}>Review Mode</span>}
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
            style={{ 
              borderLeft: isCorrect ? '4px solid #10b981' : isIncorrect ? '4px solid #ef4444' : '4px solid transparent'
            }}
          >
            <div className="para-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {isCorrect ? <CheckCircle size={14} color="#10b981" /> : 
               isIncorrect ? <XCircle size={14} color="#ef4444" /> : 
               <span className="question-label">{String(q.id).replace(/^q/, '')}.</span>}
            </div>
            
            <p className="question-text" style={{ marginBottom: '16px' }}>{q.text}</p>
            
            <div className="select-wrapper" style={{ minWidth: '180px' }}>
              <select 
                className={`answer-input ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                value={userAnswers[q.id] || ""}
                disabled={isReviewMode}
                onChange={(e) => handleSelect(q.id, e.target.value)}
                style={{ 
                  width: '100%',
                  opacity: isReviewMode ? 0.8 : 1,
                  cursor: isReviewMode ? 'default' : 'pointer',
                  borderColor: isCorrect ? '#10b981' : isIncorrect ? '#ef4444' : '#cbd5e1'
                }}
              >
                <option value="" disabled>Select Heading...</option>
                {headings.map((heading, idx) => (
                  <option key={idx} value={idx}>
                    {idx + 1}. {heading}
                  </option>
                ))}
              </select>

              {(isIncorrect || isMissing) && correctChoice !== undefined && (
                <div className="correct-answer-hint">
                  Correct: {parseInt(correctChoice) + 1}. {headings[correctChoice]}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeadingMatchBlock;
