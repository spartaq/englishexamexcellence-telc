import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './MatchingChoiceBlock.css';

/**
 * MatchingChoiceBlock - IELTS Type 4: Matching Information
 * 
 * Match questions to letter options (A, B, C, etc.).
 * Options may represent paragraphs, sections, or categories.
 * 
 * Enhanced with:
 * - Support for "use any letter more than once"
 * - Visual tracking of option usage
 * - Better review mode feedback
 */
export default function MatchingChoiceBlock({ 
  data, 
  onUpdate, 
  userAnswers = {}, 
  isReviewMode,
  hideInstruction = false,
  // Enhanced props
  allowReuse = false, // Whether options can be used more than once
  showUsageCount = true // Show how many times each option is used
}) {
  // Logic to determine available options (A, B, C, D...)
  const getOptions = () => {
    // 1. If content is provided in the data (as HTML strings)
    if (data.content && Array.isArray(data.content)) {
      return data.content.map((item, index) => {
        const match = String(item).match(/\[([A-Z])\]/);
        return match ? match[1] : String.fromCharCode(65 + index); // Fallback to A, B, C...
      });
    }
    // 2. If options are explicitly provided
    if (data.options) return data.options;
    
    // 3. Fallback: Determine how many letters based on answers in questions
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; 
  };

  const options = getOptions();
  
  // Get passage content (handle array or string)
  const getContentHtml = () => {
    const content = data.parentContent || data.content;
    if (!content) return '';
    if (Array.isArray(content)) return content.join('');
    return content;
  };
  
  // Determine if reuse is allowed from data or prop
  const canReuse = allowReuse || data.allowReuse || false;
  
  // Ensure we are looking at an array of questions
  const questions = data.questions || (data.text ? [data] : []);

  // Count how many times each option is used
  const getOptionUsageCount = (option) => {
    return Object.values(userAnswers).filter(answer => answer === option).length;
  };

  // Check if an option has already been used (for single-use mode)
  const isOptionUsed = (option, currentQuestionId) => {
    if (canReuse) return false;
    
    // Check if any other question has this option selected
    return Object.entries(userAnswers).some(([qId, answer]) => 
      answer === option && qId !== currentQuestionId
    );
  };

  const handleSelect = (qId, value) => {
    if (isReviewMode) return;
    onUpdate(qId, value);
  };

  if (questions.length === 0) return null;

  // Normalize for comparison
  const normalizeAnswer = (answer) => {
    if (answer === undefined || answer === null) return '';
    return String(answer).trim().toUpperCase();
  };

  return (
    <div className="matching-choice-container">
      {/* Reading Passage */}
      {getContentHtml() && (
        <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div 
            className="reading-passage"
            dangerouslySetInnerHTML={{ __html: `<style>.reading-passage p { margin-bottom: 12px; }</style>` + getContentHtml() }} 
          />
        </div>
      )}

      {/* Instruction Box */}
      {!hideInstruction && data.instruction && (
        <div className="question-instruction">
          {data.instruction}
        </div>
      )}
      
      {/* Reuse indicator */}
      {canReuse && (
        <div style={{
          background: '#eef2ff',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px',
          color: 'var(--lab-indigo)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          You may use any letter more than once.
        </div>
      )}

      {/* Option usage summary (optional) */}
      {showUsageCount && !isReviewMode && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          {options.map(opt => {
            const count = getOptionUsageCount(opt);
            return (
              <span 
                key={opt}
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: count > 0 ? '#dcfce7' : '#f1f5f9',
                  color: count > 0 ? '#166534' : '#64748b',
                  border: '1px solid',
                  borderColor: count > 0 ? '#22c55e' : '#e2e8f0'
                }}
              >
                {opt} {count > 0 && `(${count})`}
              </span>
            );
          })}
        </div>
      )}

      {questions.map((q) => {
        const userAnswer = userAnswers[q.id];
        const correctAnswer = q.answer;
        const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
        const isWrong = userAnswer !== undefined && !isCorrect;
        const isMissing = isReviewMode && userAnswer === undefined;

        return (
          <div 
            key={q.id} 
            className={`question-card ${isReviewMode ? (isCorrect ? 'correct' : isWrong ? 'incorrect' : '') : ''}`}
          >
            <div className="matching-choice-text" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span className="question-label">{q.id}.</span>
              <p className="question-text" style={{ marginBottom: 0, flex: 1 }}>{q.text}</p>
              
              {isReviewMode && (
                <span className="status-icon">
                  {isCorrect ? 
                    <CheckCircle size={18} color="#10b981" /> : 
                    isMissing ?
                    <AlertCircle size={18} color="#f59e0b" /> :
                    <XCircle size={18} color="#ef4444" />
                  }
                </span>
              )}
            </div>
            
            <div className="choice-button-group" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {options.map((opt) => {
                const isSelected = userAnswer === opt;
                const isTheRightAnswer = normalizeAnswer(correctAnswer) === opt;
                const isUsed = isOptionUsed(opt, q.id);
                const usageCount = getOptionUsageCount(opt);

                let stateClass = "";
                if (isReviewMode) {
                  if (isSelected && isCorrect) stateClass = "review-correct";
                  else if (isSelected && !isCorrect) stateClass = "review-incorrect";
                  else if (isTheRightAnswer) stateClass = "review-correct";
                } else if (isSelected) {
                  stateClass = "selected";
                } else if (isUsed && !canReuse) {
                  stateClass = "review-dimmed";
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    className={`option-button ${stateClass}`}
                    onClick={() => handleSelect(q.id, opt)}
                    disabled={isReviewMode || (isUsed && !canReuse)}
                    title={isUsed && !canReuse ? 'Already used' : ''}
                  >
                    {opt}
                    {/* Usage indicator for reuse mode */}
                    {canReuse && !isReviewMode && isSelected && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: 'var(--lab-indigo)',
                        color: 'white',
                        fontSize: '9px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {usageCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Correct answer hint in review mode */}
            {isReviewMode && (isWrong || isMissing) && (
              <div style={{
                gridColumn: '1 / -1',
                marginTop: '8px',
                padding: '8px 12px',
                background: '#ecfdf5',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#059669',
                fontWeight: 600
              }}>
                Correct answer: {correctAnswer}
              </div>
            )}
          </div>
        );
      })}

      {/* Review Mode Summary */}
      {isReviewMode && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Score: {
                questions.filter(q => 
                  normalizeAnswer(userAnswers[q.id]) === normalizeAnswer(q.answer)
                ).length
              } / {questions.length}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {Math.round((questions.filter(q => 
                normalizeAnswer(userAnswers[q.id]) === normalizeAnswer(q.answer)
              ).length / questions.length) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
