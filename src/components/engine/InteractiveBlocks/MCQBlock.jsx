import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './MCQBlock.css';

/**
 * MCQBlock - IELTS Type 1: Multiple Choice
 * 
 * Handles both array of questions (from subTasks) and single question.
 * Supports multi-select mode.
 */
const MCQBlock = ({ 
  data, 
  onSelect, 
  selectedAnswer, 
  isReviewMode = false,
  userAnswers = {},
  onUpdate = () => {},
  multiSelect = false,
  selectedAnswers = [],
  onMultiSelect = null,
  minSelect = 1,
  maxSelect = null
}) => {
  // Handle both array of questions (from subTasks) and single question
  const questions = data.questions || (data.text ? [data] : []);
  const instruction = data.instruction;
  
  // Get first question for basic props (for backward compatibility)
  const firstQ = questions[0] || {};
  const questionText = firstQ.question || firstQ.text || data.question || data.text || "";
  const correctAnswer = data.correctIndex ?? firstQ.answer ?? data.answer;
  const options = firstQ.options || data.options || [];
  
  // Multi-select correct answers
  const correctAnswers = data.correctIndices ?? 
                         (Array.isArray(data.correctIndex) ? data.correctIndex : 
                         (Array.isArray(data.answer) ? data.answer : null));
  
  const [internalSelected, setInternalSelected] = useState([]);
  
  const isMultiSelect = multiSelect || data.multiSelect || Array.isArray(correctAnswers);
  
  // Use data.id for the parent level, or derive from first question
  const questionId = data.id || firstQ.id;
  const userAnswerFromState = userAnswers[questionId];
  
  const currentSelections = isMultiSelect 
    ? (selectedAnswers || (userAnswerFromState !== undefined ? userAnswerFromState : internalSelected))
    : (selectedAnswer !== undefined ? [selectedAnswer] : (userAnswerFromState !== undefined ? [userAnswerFromState] : []));
  
  const maxSelections = maxSelect ?? data.maxSelect ?? options.length;

  const handleSingleSelect = (idx) => {
    if (isReviewMode) return;
    if (onUpdate && questionId) {
      onUpdate(questionId, idx);
    }
    if (onSelect) onSelect(idx);
  };

  const handleMultiSelect = (idx) => {
    if (isReviewMode) return;
    
    let newSelections;
    if (currentSelections.includes(idx)) {
      newSelections = currentSelections.filter(i => i !== idx);
    } else {
      if (currentSelections.length >= maxSelections) return;
      newSelections = [...currentSelections, idx];
    }
    
    if (onMultiSelect) {
      onMultiSelect(newSelections);
    } else {
      setInternalSelected(newSelections);
    }
    
    if (onUpdate && questionId) {
      onUpdate(questionId, newSelections);
    }
    if (onSelect) onSelect(newSelections);
  };

  const isSelected = (idx) => {
    return isMultiSelect 
      ? currentSelections.includes(idx)
      : (currentSelections.length > 0 ? currentSelections[0] === idx : selectedAnswer === idx);
  };

  const isCorrectOption = (idx) => {
    if (isMultiSelect && correctAnswers) {
      return correctAnswers.includes(idx);
    }
    return correctAnswer === idx || correctAnswer === options[idx];
  };

  const isUserCorrect = () => {
    if (isMultiSelect && correctAnswers) {
      const sortedUser = [...currentSelections].sort();
      const sortedCorrect = [...correctAnswers].sort();
      return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
    }
    return selectedAnswer === correctAnswer || selectedAnswer === correctAnswer;
  };

  const getSelectionText = () => {
    if (!isMultiSelect) return null;
    const count = currentSelections.length;
    const required = minSelect > 1 ? ` (min ${minSelect})` : '';
    return `Selected: ${count}${required}`;
  };

  // If no questions, show empty state
  if (questions.length === 0) return null;
  
  // Render each question in the array
  return (
    <div className="mcq-questions-container">
      {/* Instruction Box - shown once for the whole block */}
      {instruction && (
        <div className="question-instruction">
          {instruction}
        </div>
      )}
      
      {/* Multi-select indicator */}
      {isMultiSelect && !isReviewMode && currentSelections.length > 0 && (
        <div className={`mcq-multi-indicator ${currentSelections.length >= minSelect ? 'minimum-met' : 'needs-more'}`}>
          {getSelectionText()}
          {maxSelections < options.length && ` / ${maxSelections} max`}
        </div>
      )}
      
      {/* Render each question */}
      {questions.map((q, qIdx) => {
        const qId = q.id || `q-${qIdx}`;
        const qText = q.text || q.question || "";
        const qOptions = q.options || [];
        const qAnswer = q.answer;
        
        // Get user answer for this specific question
        const qUserAnswer = userAnswers[qId];
        
        // Single question renders
        return (
          <div key={qId} className="question-card" style={{ marginBottom: '24px' }}>
            {/* Question */}
            <h3 className={`mcq-question ${isMultiSelect ? 'multiselect' : ''}`}>
              <span className="mcq-question-label">{String(qId).replace(/^q/, '')}.</span>
              {qText}
              {isMultiSelect && (
                <span className="mcq-question-subtext" style={{ display: 'block', fontSize: '13px', fontWeight: '400', color: '#64748b', marginTop: '4px' }}>
                  {data.selectInstruction || `Choose ${minSelect > 1 ? `${minSelect} or more` : 'all that apply'}.`}
                </span>
              )}
            </h3>

            {/* Options */}
            <div className="options-list">
              {qOptions.map((option, idx) => {
                // Check selection - use per-question user answer
                const isSelectedForQ = isMultiSelect 
                  ? (Array.isArray(qUserAnswer) && qUserAnswer.includes(idx))
                  : qUserAnswer === idx;
                
                const isCorrectForQ = isMultiSelect
                  ? (Array.isArray(qAnswer) && qAnswer.includes(idx))
                  : qAnswer === idx || qAnswer === option;
                
                let optionClasses = 'mcq-option';
                if (isSelectedForQ) {
                  optionClasses += ' selected';
                  if (isMultiSelect) optionClasses += ' multiselect';
                }
                if (isReviewMode) {
                  if (isCorrectForQ) {
                    optionClasses += ' review-correct';
                  } else if (isSelectedForQ && !isCorrectForQ) {
                    optionClasses += ' review-incorrect';
                  } else {
                    optionClasses += ' review-dimmed';
                  }
                }
                
                const handleClick = () => {
                  if (isReviewMode) return;
                  
                  if (isMultiSelect) {
                    let newSelections;
                    if (Array.isArray(qUserAnswer)) {
                      if (qUserAnswer.includes(idx)) {
                        newSelections = qUserAnswer.filter(i => i !== idx);
                      } else {
                        newSelections = [...qUserAnswer, idx];
                      }
                    } else {
                      newSelections = [idx];
                    }
                    onUpdate(qId, newSelections);
                  } else {
                    onUpdate(qId, idx);
                  }
                };
                
                return (
                  <button
                    key={idx}
                    onClick={handleClick}
                    disabled={isReviewMode}
                    className={optionClasses}
                  >
                    {isMultiSelect && !isReviewMode && (
                      <span className={`mcq-checkbox ${isSelectedForQ ? 'selected' : ''}`} style={{ 
                        width: '18px', height: '18px', borderRadius: '4px', border: '2px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {isSelectedForQ && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                    )}
                    
                    <span className="option-text">{option}</span>
                    
                    {isReviewMode && (
                      <span className="status-icon">
                        {isCorrectForQ && <CheckCircle size={18} color="#10b981" />}
                        {isSelectedForQ && !isCorrectForQ && <XCircle size={18} color="#ef4444" />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* Minimum selection warning */}
      {isMultiSelect && !isReviewMode && currentSelections.length < minSelect && (
        <div className="tip-box" style={{ marginTop: '12px' }}>
          <AlertCircle size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Please select at least {minSelect} option{minSelect > 1 ? 's' : ''}.
        </div>
      )}
    </div>
  );
};

export default MCQBlock;