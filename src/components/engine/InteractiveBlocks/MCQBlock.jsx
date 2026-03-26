import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './MCQBlock.css';

/**
 * MCQBlock - IELTS Type 1: Multiple Choice
 * 
 * Single or multiple answer multiple choice questions.
 * 
 * Enhanced with:
 * - Multi-select mode (choose more than one answer)
 * - Configurable number of correct answers
 * - Better visual feedback for multi-select
 */
const MCQBlock = ({ 
  data, 
  onSelect, 
  selectedAnswer, 
  isReviewMode = false,
  // Support userAnswers and onUpdate for integration with parent state
  userAnswers = {},
  onUpdate = () => {},
  // Enhanced props
  multiSelect = false, // Enable multi-select mode
  selectedAnswers = [], // Array for multi-select mode
  onMultiSelect = null, // Callback for multi-select: (selectedIndices) => void
  minSelect = 1, // Minimum selections required
  maxSelect = null // Maximum selections allowed (null = unlimited)
}) => {
  const questionText = data.question || data.text || "";
  const correctAnswer = data.correctIndex ?? data.answer;
  const options = data.options || [];
  
  // Multi-select correct answers (can be array or single value)
  const correctAnswers = data.correctIndices ?? 
                         (Array.isArray(data.correctIndex) ? data.correctIndex : 
                         (Array.isArray(data.answer) ? data.answer : null));
  
  // Internal state for multi-select if not controlled
  const [internalSelected, setInternalSelected] = useState([]);
  
  // Determine if we're in multi-select mode
  const isMultiSelect = multiSelect || data.multiSelect || Array.isArray(correctAnswers);
  
  // Get current selections - check userAnswers first (from parent state), then fall back to props
  const questionId = data.id;
  const userAnswerFromState = userAnswers[questionId];
  const currentSelections = isMultiSelect 
    ? (selectedAnswers || (userAnswerFromState !== undefined ? userAnswerFromState : internalSelected))
    : (selectedAnswer !== undefined ? [selectedAnswer] : (userAnswerFromState !== undefined ? [userAnswerFromState] : []));
  
  // Maximum selections allowed
  const maxSelections = maxSelect ?? data.maxSelect ?? options.length;

  // Handle single selection
  const handleSingleSelect = (idx) => {
    if (isReviewMode) return;
    // Call onUpdate to sync with parent state
    if (onUpdate && questionId) {
      onUpdate(questionId, idx);
    }
    if (onSelect) onSelect(idx);
  };

  // Handle multi-selection toggle
  const handleMultiSelect = (idx) => {
    if (isReviewMode) return;
    
    let newSelections;
    if (currentSelections.includes(idx)) {
      // Deselect
      newSelections = currentSelections.filter(i => i !== idx);
    } else {
      // Select (check max limit)
      if (currentSelections.length >= maxSelections) {
        // Replace oldest selection or don't allow
        return;
      }
      newSelections = [...currentSelections, idx];
    }
    
    // Update state
    if (onMultiSelect) {
      onMultiSelect(newSelections);
    } else {
      setInternalSelected(newSelections);
    }
    
    // Call onUpdate to sync with parent state
    if (onUpdate && questionId) {
      onUpdate(questionId, newSelections);
    }
    
    // Also call onSelect for compatibility
    if (onSelect) {
      onSelect(newSelections);
    }
  };

  // Check if an option is selected
  const isSelected = (idx) => {
    return isMultiSelect 
      ? currentSelections.includes(idx)
      : (currentSelections.length > 0 ? currentSelections[0] === idx : selectedAnswer === idx);
  };

  // Check if an option is correct
  const isCorrectOption = (idx) => {
    if (isMultiSelect && correctAnswers) {
      return correctAnswers.includes(idx);
    }
    return correctAnswer === idx || correctAnswer === options[idx];
  };

  // Check if user got it right
  const isUserCorrect = () => {
    if (isMultiSelect && correctAnswers) {
      // All correct must be selected, no incorrect selected
      const sortedUser = [...currentSelections].sort();
      const sortedCorrect = [...correctAnswers].sort();
      return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
    }
    return selectedAnswer === correctAnswer || selectedAnswer === correctAnswer;
  };

  // Get selection count text
  const getSelectionText = () => {
    if (!isMultiSelect) return null;
    const count = currentSelections.length;
    const required = minSelect > 1 ? ` (min ${minSelect})` : '';
    return `Selected: ${count}${required}`;
  };

  // If no options and no question, show empty state
  if (!questionText && options.length === 0) return null;

  return (
    <div className="question-card">
      {/* Instruction Box */}
      {data.instruction && (
        <div className="question-instruction">
          {data.instruction}
        </div>
      )}
      

      {/* Multi-select indicator */}
      {isMultiSelect && !isReviewMode && (
        <div className={`mcq-multi-indicator ${currentSelections.length >= minSelect ? 'minimum-met' : 'needs-more'}`}>
          {getSelectionText()}
          {maxSelections < options.length && ` / ${maxSelections} max`}
        </div>
      )}

      {/* Question */}
      <h3 className={`question-text ${isMultiSelect ? 'multiselect' : ''}`}>
        <span className="question-label">{String(data.id).replace(/^q/, '')}.</span>
        {data.question || data.text}
        {isMultiSelect && (
          <span className="mcq-question-subtext" style={{ display: 'block', fontSize: '13px', fontWeight: '400', color: '#64748b', marginTop: '4px' }}>
            {data.selectInstruction || `Choose ${minSelect > 1 ? `${minSelect} or more` : 'all that apply'}.`}
          </span>
        )}
      </h3>

      {/* Options */}
      <div className="options-list">
        {options.map((option, idx) => {
          const selected = isSelected(idx);
          const isCorrect = isCorrectOption(idx);
          
          // Build class names for the option button
          let optionClasses = 'option-button';
          if (selected) {
            optionClasses += ' selected';
            if (isMultiSelect) optionClasses += ' multiselect';
          }
          if (isReviewMode) {
            if (isCorrect) {
              optionClasses += ' review-correct';
            } else if (selected && !isCorrect) {
              optionClasses += ' review-incorrect';
            } else {
              optionClasses += ' review-dimmed';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => isMultiSelect ? handleMultiSelect(idx) : handleSingleSelect(idx)}
              disabled={isReviewMode}
              className={optionClasses}
            >
              {/* Multi-select checkbox indicator */}
              {isMultiSelect && !isReviewMode && (
                <span className={`mcq-checkbox ${selected ? 'selected' : ''}`} style={{ 
                  width: '18px', height: '18px', borderRadius: '4px', border: '2px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              )}
              
              {/* Option letter for multi-select */}
              {isMultiSelect && (
                <span className={`option-letter ${selected ? 'selected' : ''}`}>
                  {String.fromCharCode(65 + idx)}.
                </span>
              )}
              
              <span className="option-text">{option}</span>
              
              {isReviewMode && (
                <span className="status-icon">
                  {isCorrect && <CheckCircle size={18} color="#10b981" />}
                  {selected && !isCorrect && <XCircle size={18} color="#ef4444" />}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Multi-select minimum warning */}
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

