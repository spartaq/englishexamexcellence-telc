import React from 'react';
import { CheckCircle, XCircle, ArrowDown } from 'lucide-react';
import './FlowChartCompletionBlock.css';

/**
 * FlowChartCompletionBlock - IELTS Type 9: Flow-Chart Completion
 * 
 * Complete a flow-chart (series of boxes/steps linked by arrows).
 * Word limit applies (e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER")
 */
const FlowChartCompletionBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false,
  hideInstruction = false
}) => {
  // Support both 'steps' (native) and 'questions' (from mock data) formats
  // Convert questions to steps if needed
  let {
    title,
    flowchart = null, // Flowchart text/image similar to diagram in DiagramLabelBlock
    steps = [],
    questions = [],
    wordLimit = 2,
    wordList = null,
    instruction = `Complete the flow-chart. Write NO MORE THAN ${wordLimit} WORDS AND/OR A NUMBER for each answer.`,
    direction = 'vertical' // 'horizontal' or 'vertical'
  } = data;

  // If questions array is provided but steps is empty, transform questions to steps
  if (questions.length > 0 && steps.length === 0) {
    steps = questions.map((q, idx) => ({
      id: q.id || `step-${idx + 1}`,
      type: 'gap',
      text: q.text || `Step ${idx + 1}`,
      answer: q.answer || ''
    }));
  }

  // Word count validation
  const countWords = (text) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  };

  const isOverLimit = (text) => {
    return countWords(text) > wordLimit;
  };

  // Normalize answer for comparison
  const normalizeAnswer = (text) => {
    if (!text) return '';
    return text.trim().toLowerCase();
  };

  const handleInputChange = (stepId, value) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(stepId, value);
  };

  // Render flowchart text/image if provided (similar to diagram in DiagramLabelBlock)
  const renderFlowchart = () => {
    if (!flowchart) return null;

    return (
      <div className="flowchart-container">
        {flowchart.text && (
          <p className="flowchart-text">
            {flowchart.text}
          </p>
        )}
        {flowchart.src && (
          <img
            src={flowchart.src}
            alt={flowchart.alt || 'Flowchart'}
            className="flowchart-image"
            style={{
              maxWidth: flowchart.width || '100%',
              maxHeight: flowchart.height || '400px',
              objectFit: 'contain'
            }}
          />
        )}
        {flowchart.caption && (
          <p className="flowchart-caption">
            {flowchart.caption}
          </p>
        )}
      </div>
    );
  };

  // Render a single step
  const renderStep = (step, index, isLast) => {
    const isGap = step.type === 'gap';
    const userAnswer = userAnswers[step.id] || '';
    const correctAnswer = step.answer || '';
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
    const isWrong = userAnswer && !isCorrect;
    const isMissing = isReviewMode && !userAnswer;
    const overLimit = isOverLimit(userAnswer);

    // Build class name for the step
    let stepClassName = 'flow-step';
    if (isGap) stepClassName += ' is-gap';
    if (overLimit) stepClassName += ' over-limit';
    if (isReviewMode) stepClassName += isCorrect ? ' row-correct' : ' row-incorrect';

    return (
      <React.Fragment key={step.id}>
        <div className={stepClassName}>
          {/* Step content */}
          <div className="step-content">
            {isGap ? (
              /* Gap input */
              <div>
                {/* Show step text for gaps (e.g., "Step 1: ______ the pin.") */}
                {step.text && (
                  <p className="step-text gap-text">
                    <span className="question-label">{String(step.id).replace(/^q/, '')}.</span>
                    {step.text}
                  </p>
                )}
                {wordList ? (
                  /* Dropdown mode */
                  <div className="flow-input-container">
                    <select
                      value={userAnswer}
                      onChange={(e) => handleInputChange(step.id, e.target.value)}
                      disabled={isReviewMode}
                      className="flow-select"
                    >
                      <option value="">Select...</option>
                      {wordList.map((word, idx) => (
                        <option key={idx} value={word}>{word}</option>
                      ))}
                    </select>
                    {isReviewMode && (
                      <span>
                        {isCorrect ? 
                          <CheckCircle size={18} color="#10b981" /> : 
                          <XCircle size={18} color="#ef4444" />
                        }
                      </span>
                    )}
                  </div>
                ) : (
                  /* Text input mode */
                  <div>
                    <div className="flow-input-container">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => handleInputChange(step.id, e.target.value)}
                        disabled={isReviewMode}
                        placeholder={isReviewMode ? '' : `${wordLimit} words max`}
                        className="flow-input"
                      />
                      {isReviewMode && (
                        <span>
                          {isCorrect ? 
                            <CheckCircle size={18} color="#10b981" /> : 
                            <XCircle size={18} color="#ef4444" />
                          }
                        </span>
                      )}
                    </div>
                    {/* Word count */}
                    {!isReviewMode && (
                      <div className={`flow-word-count ${overLimit ? 'over-limit' : ''}`}>
                        {countWords(userAnswer)}/{wordLimit} words
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Static text */
              <p className="step-text">
                {step.text}
              </p>
            )}
          </div>
        </div>

        {/* Arrow connector */}
        {!isLast && (
          <div className="flow-arrow">
            <ArrowDown size={24} color="#94a3b8" />
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flowchart-completion-block">
      {/* Header */}
      <div className="flowchart-header">
        <h3 className="flowchart-title">
          {title || 'Flow-Chart Completion'}
        </h3>
        {isReviewMode && (
          <span className="flowchart-badge">
            Review Mode
          </span>
        )}
      </div>

      {/* Instruction - hide if hideInstruction prop is true */}
      {!hideInstruction && (
        <div className="flowchart-instruction">
          {instruction}
        </div>
      )}

      {/* Flowchart Text/Image (if provided) */}
      {renderFlowchart()}

      {/* Word List (if provided) */}
      {wordList && (
        <div className="flowchart-word-list">
          <p className="word-list-label">
            Word List
          </p>
          <div className="word-list-items">
            {wordList.map((word, idx) => (
              <span 
                key={idx}
                className="word-list-item"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flow Chart - vertical layout by default */}
      <div className="flow-chart">
        {steps.map((step, index) => 
          renderStep(step, index, index === steps.length - 1)
        )}
      </div>
    </div>
  );
};

export default FlowChartCompletionBlock;

