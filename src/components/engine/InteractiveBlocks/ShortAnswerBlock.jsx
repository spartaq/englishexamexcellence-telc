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
      {!hideInstruction && (
        <div className="sa-instruction-box">
          <AlertTriangle size={16} className="sa-warning-icon" />
          <span className="sa-instruction-text">{instructionText}</span>
        </div>
      )}
      
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
              className={`sa-row ${isReviewMode ? (isCorrect ? 'correct' : 'incorrect') : overLimit ? 'over-limit' : ''}`}
            >
              <div className="sa-question-header">
                <span className="sa-question-num">{q.id || index + 1}.</span>
                <p className="sa-question-text">{q.text}</p>
                {isReviewMode && (
                  <span className="sa-status-icon">
                    {isCorrect ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
                  </span>
                )}
              </div>

              <div className="sa-input-section">
                <div className="sa-input-container">
                  <input 
                    type="text"
                    disabled={isReviewMode}
                    className={`sa-input ${isReviewMode ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                    placeholder={isReviewMode ? "" : "Type answer here..."}
                    value={currentAnswer}
                    onChange={(e) => onUpdate(q.id, e.target.value)}
                  />
                  
                  {limit && !isReviewMode && (
                    <div className="sa-word-counter">
                      <span className={overLimit ? 'text-danger' : ''}>
                        {total}/{limit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Validation Warnings */}
                {overLimit && !isReviewMode && (
                  <div className="sa-error-msg">
                    <AlertTriangle size={12} /> Limit: {limit} words
                  </div>
                )}

                {/* Review Mode Answer Key */}
                {isReviewMode && !isCorrect && (
                  <div className="sa-correct-answer">
                    <strong>Correct:</strong> {q.answer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isReviewMode && (
        <div className="sa-tip-box">
          <strong>Tip:</strong> Ensure spelling is correct and you stay within the word limit.
        </div>
      )}
    </div>
  );
};

export default ShortAnswerBlock;