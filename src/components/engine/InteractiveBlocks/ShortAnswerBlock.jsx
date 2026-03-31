import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import './ShortAnswerBlock.css';

/**
 * ShortAnswerBlock - IELTS Type 11: Short-Answer Questions
 * Handles a group of questions under a single instruction.
 */
const ShortAnswerBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode,
  wordLimit = null,
  allowNumber = true,
  validateFromText = false,
  sourceText = null,
  hideInstruction = false // New prop to manually suppress instruction if needed
}) => {
  // 1. Logic to extract questions: Supports an array or a single question object
  const questions = data.questions || (data.text ? [data] : []);
  
  // 2. Determine limits
  const limit = data.wordLimit || wordLimit;
  const allowNum = data.allowNumber !== undefined ? data.allowNumber : allowNumber;

  // 3. Word count validation logic
  const countWordsAndNumbers = (text) => {
    if (!text) return { words: 0, numbers: 0, total: 0 };
    const tokens = text.trim().split(/\s+/).filter(t => t.length > 0);
    let words = 0;
    let numbers = 0;
    
    tokens.forEach(token => {
      if (/^\d+(\.\d+)?$/.test(token)) {
        numbers++;
      } else {
        words++;
      }
    });
    
    return { words, numbers, total: allowNum ? words + numbers : words };
  };

  const isOverLimit = (text) => {
    if (!limit) return false;
    const { total } = countWordsAndNumbers(text);
    return total > limit;
  };

  // 4. Generate the single instruction text
  const instructionText = data.instruction || (() => {
    if (!limit) return "Answer the questions below:";
    const wordText = limit === 1 ? 'ONE WORD' : limit === 2 ? 'TWO WORDS' : `${limit} WORDS`;
    const numberPart = allowNum ? ' AND/OR A NUMBER' : '';
    return `Write NO MORE THAN ${wordText}${numberPart} for each answer.`;
  })();

  return (
    <div className="short-answer-container">
      {/* 5. SINGLE INSTRUCTION BOX (Rendered once for the whole block) */}
      {/* Temporarily hidden - will be handled later */}
      {/* {!hideInstruction && (
        <div className="question-instruction">
          <AlertTriangle size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
          <span>{instructionText}</span>
        </div>
      )} */}
      
      {/* 6. LIST OF QUESTIONS */}
      <div className="sa-questions-wrapper">
        {questions.map((q, index) => {
          const currentAnswer = userAnswers[q.id] || '';
          const userVal = currentAnswer.trim().toLowerCase();
          const correctVal = (q.answer || '').toLowerCase();
          const isCorrect = userVal === correctVal;
          const overLimit = isOverLimit(currentAnswer);
          const { words, numbers, total } = countWordsAndNumbers(currentAnswer);

          return (
            <div 
              key={q.id || index} 
              className={`question-card ${isReviewMode ? (isCorrect ? 'correct' : 'incorrect') : overLimit ? 'over-limit' : ''}`}
            >
              <h3 className="sa-question">
                <span className="question-label">{String(q.id || index + 1).replace(/^q/, '')}.</span>
                {q.text}
                {isReviewMode && (
                  <span className="status-icon">
                    {isCorrect ? <CheckCircle size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                  </span>
                )}
              </h3>

              <div className="sa-input-section">
                <div className="sa-input-container">
                  <input 
                    type="text"
                    disabled={isReviewMode}
                    className={`answer-input ${isReviewMode ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                    placeholder={isReviewMode ? "" : "Type answer here... (Limit 3 words)"}
                    value={currentAnswer}
                    onChange={(e) => onUpdate(q.id, e.target.value)}
                  />
                  
                  
                </div>

                {/* Validation Warnings */}
                {overLimit && !isReviewMode && (
                  <div className="tip-box" style={{ marginTop: '8px' }}>
                    <AlertTriangle size={12} style={{ marginRight: '6px' }} /> Limit: {limit} words
                  </div>
                )}

                {/* Review Mode Answer Key */}
                {isReviewMode && !isCorrect && (
                  <div className="correct-answer-hint">
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isReviewMode && (
        <div className="tip-box">
          <strong>Tip:</strong> Ensure spelling is correct and you stay within the word limit.
        </div>
      )}
    </div>
  );
};

export default ShortAnswerBlock;
