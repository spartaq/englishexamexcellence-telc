import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './MatchingFeaturesBlock.css';

/**
 * MatchingFeaturesBlock - IELTS Type 6: Matching Features
 * 
 * Match statements or pieces of information to a list of options (features).
 * Features are identified by letters (A, B, C, etc.).
 * Some options may not be used, others may be used more than once.
 * 
 * Enhanced with:
 * - Full review mode with correct/incorrect feedback
 * - Support for "use more than once" options
 * - Visual tracking of option usage
 */
const MatchingFeaturesBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false,
  allowReuse = false // Whether options can be used more than once
}) => {
  const { 
    parentContent = '',
    features = [], 
    questions = [],
    instruction = 'Match each statement to the correct feature.',
    allowReuse: dataAllowReuse = false
  } = data;

  // For backwards compatibility, also check content field
  // Handle array content by joining, or use string content directly
  const content = data.content || parentContent;
  
  const getContentHtml = () => {
    if (!content) return '';
    if (Array.isArray(content)) return content.join('');
    return content;
  };

  // Determine if reuse is allowed
  const canReuse = allowReuse || dataAllowReuse;

  // Count how many times each feature is used
  const getFeatureUsageCount = (featureId) => {
    return Object.values(userAnswers).filter(answer => answer === featureId).length;
  };

  // Check if a feature has already been used (for single-use mode)
  const isFeatureUsed = (featureId, currentQuestionId) => {
    if (canReuse) return false;
    
    // Check if any other question has this feature selected
    return Object.entries(userAnswers).some(([qId, answer]) => 
      answer === featureId && qId !== currentQuestionId
    );
  };

  // Handle selection
  const handleSelect = (qId, featureId) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(qId, featureId);
  };

  // Normalize for comparison
  const normalizeAnswer = (answer) => {
    if (answer === undefined || answer === null) return '';
    return String(answer).trim().toLowerCase();
  };

  // Render features box
  const renderFeaturesBox = () => {
    return (
      <div className="features-box">
        <div className="features-header">
          <h4 className="features-title">
            Features
          </h4>
          {canReuse && (
            <span className="reuse-badge">
              May be used more than once
            </span>
          )}
        </div>
        
        <div className="features-list">
          {features.map(feature => {
            const usageCount = getFeatureUsageCount(feature.id);
            const isUsed = usageCount > 0;
            
            return (
              <div 
                key={feature.id}
                className={`feature-item ${isUsed && !canReuse ? 'feature-used' : ''}`}
              >
                <span className="feature-id">
                  {feature.id}
                </span>
                <span className="feature-name">
                  {feature.name}
                </span>
                {isUsed && (
                  <span className={`usage-badge ${canReuse ? 'reuse' : 'single'}`}>
                    {canReuse ? `Used ${usageCount}x` : 'Used'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render questions
  const renderQuestions = () => {
    return (
      <>
        {questions.map((q, index) => {
          const userAnswer = userAnswers[q.id];
          const correctAnswer = q.answer;
          const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
          const isWrong = userAnswer !== undefined && !isCorrect;
          const isMissing = isReviewMode && userAnswer === undefined;

          return (
            <div 
              key={q.id || index}
              className={`question-row ${isReviewMode ? (isCorrect ? 'row-correct' : 'row-incorrect') : ''}`}
            >
              <div className="question-content">
                {/* Question number */}
                <span className="question-number">
                  {q.id}.
                </span>

                {/* Question text */}
                <p className="question-text">
                  {q.text}
                </p>

                {/* Status icon in review mode */}
                {isReviewMode && (
                  <span className="status-icon">
                    {isCorrect ? 
                      <CheckCircle size={20} color="#10b981" /> : 
                      isMissing ?
                      <AlertCircle size={20} color="#f59e0b" /> :
                      <XCircle size={20} color="#ef4444" />
                    }
                  </span>
                )}

                {/* Dropdown selector */}
                <div className="select-wrapper">
                  <select 
                    value={userAnswer || ''}
                    onChange={(e) => handleSelect(q.id, e.target.value)}
                    disabled={isReviewMode}
                    className="feature-select"
                  >
                    <option value="">Select...</option>
                    {features.map(feature => {
                      const isUsed = isFeatureUsed(feature.id, q.id);
                      return (
                        <option 
                          key={feature.id} 
                          value={feature.id}
                          disabled={isUsed && !canReuse}
                        >
                          {feature.id}{isUsed && !canReuse ? ' (used)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Correct answer hint in review mode */}
              {isReviewMode && (isWrong || isMissing) && (
                <div className="answer-hint">
                  <span>Correct answer:</span>
                  <span className="correct-feature-id">
                    {correctAnswer}
                  </span>
                  <span className="correct-feature-name">
                    - {features.find(f => f.id === correctAnswer)?.name || ''}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="matching-features-container">
      {/* Reading Passage */}
      {getContentHtml() && (
        <div className="mf-reading-passage">
          <div dangerouslySetInnerHTML={{ __html: getContentHtml() }} />
        </div>
      )}

      {/* Questions */}
      {renderQuestions()}

      {/* Review Mode Summary */}
      {isReviewMode && (
        <div className="review-summary">
          <div className="score-display">
            <span className="score-label">
              Score: {
                questions.filter(q => 
                  normalizeAnswer(userAnswers[q.id]) === normalizeAnswer(q.answer)
                ).length
              } / {questions.length}
            </span>
            <span className="score-percent">
              {Math.round((questions.filter(q => 
                normalizeAnswer(userAnswers[q.id]) === normalizeAnswer(q.answer)
              ).length / questions.length) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingFeaturesBlock;
