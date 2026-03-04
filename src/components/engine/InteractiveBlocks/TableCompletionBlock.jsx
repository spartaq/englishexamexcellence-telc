import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './TableCompletionBlock.css';

/**
 * TableCompletionBlock - IELTS Type 9: Table Completion
 * 
 * Complete a table using words from text or from a word list.
 * Word limit applies (e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER")
 */
const TableCompletionBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate, 
  isReviewMode = false,
  hideInstruction = false
}) => {
  const { 
    table, 
    gaps = [], 
    wordLimit = 2,
    wordList = null, // If provided, uses dropdown instead of text input
    instruction = `Complete the table. Write NO MORE THAN ${wordLimit} WORDS AND/OR A NUMBER for each answer.`
  } = data;

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

  const handleInputChange = (gapId, value) => {
    if (isReviewMode) return;
    if (onUpdate) onUpdate(gapId, value);
  };

  // Check if a cell is a gap
  const getGapInfo = (rowIndex, colIndex) => {
    return gaps.find(g => g.rowIndex === rowIndex && g.colIndex === colIndex);
  };

  // Render a single cell
  const renderCell = (content, rowIndex, colIndex) => {
    const gapInfo = getGapInfo(rowIndex, colIndex);
    
    // Regular cell (not a gap)
    if (!gapInfo) {
      return (
        <td 
          key={`${rowIndex}-${colIndex}`}
          className="table-cell"
        >
          {content}
        </td>
      );
    }

    // Gap cell
    const userAnswer = userAnswers[gapInfo.id] || '';
    const correctAnswer = gapInfo.answer || '';
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
    const isWrong = userAnswer && !isCorrect;
    const isMissing = isReviewMode && !userAnswer;
    const overLimit = isOverLimit(userAnswer);

    // Determine cell class based on state
    let cellClass = 'table-cell gap-cell';
    if (isReviewMode) {
      if (isCorrect) cellClass += ' row-correct';
      else if (isWrong || isMissing) cellClass += ' row-incorrect';
    } else if (overLimit) {
      cellClass += ' over-limit';
    }

    return (
      <td 
        key={`${rowIndex}-${colIndex}`}
        className={cellClass}
      >
        {/* Question number badge */}
        <div className="gap-badge">
          {gapInfo.id}
        </div>

        {/* Word List Mode - Dropdown */}
        {wordList ? (
          <div className="gap-input-container">
            <select
              value={userAnswer}
              onChange={(e) => handleInputChange(gapInfo.id, e.target.value)}
              disabled={isReviewMode}
              className="gap-select"
            >
              <option value="">Select...</option>
              {wordList.map((word, idx) => (
                <option key={idx} value={word}>{word}</option>
              ))}
            </select>
            {isReviewMode && (
              <span>
                {isCorrect ? 
                  <CheckCircle size={16} color="#10b981" /> : 
                  <XCircle size={16} color="#ef4444" />
                }
              </span>
            )}
          </div>
        ) : (
          /* Text Input Mode */
          <div className="gap-input-container">
            <div className="gap-input-wrapper">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => handleInputChange(gapInfo.id, e.target.value)}
                disabled={isReviewMode}
                placeholder={isReviewMode ? '' : `${wordLimit} words max`}
                className="gap-input"
              />
              {isReviewMode && (
                <span>
                  {isCorrect ? 
                    <CheckCircle size={16} color="#10b981" /> : 
                    <XCircle size={16} color="#ef4444" />
                  }
                </span>
              )}
            </div>
            {/* Word count indicator */}
            {!isReviewMode && (
              <div className={`gap-word-count ${overLimit ? 'over-limit' : ''}`}>
                {countWords(userAnswer)}/{wordLimit} words
              </div>
            )}
          </div>
        )}

        {/* Correct answer hint */}
        {isReviewMode && (isWrong || isMissing) && (
          <div className="correct-hint">
            Correct: {correctAnswer}
          </div>
        )}
      </td>
    );
  };

  // Render table
  const renderTable = () => {
    if (!table) return null;

    const { headers = [], rows = [] } = table;

    return (
      <div className="table-container">
        <table className="table-main">
          {/* Header row */}
          {headers.length > 0 && (
            <thead>
              <tr className="table-header-row">
                {headers.map((header, colIndex) => (
                  <th 
                    key={colIndex}
                    className="table-header-cell"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          
          {/* Data rows */}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="table-completion-block">
      {/* Header */}
      <div className="table-header">
        <h3 className="table-title">
          Table Completion
        </h3>
        {isReviewMode && (
          <span className="table-badge">
            Review Mode
          </span>
        )}
      </div>

      {/* Instruction */}
      {!hideInstruction && (
      <div className="question-instruction">
        {instruction}
      </div>
      )}

      {/* Word List (if provided) */}
      {wordList && (
        <div className="table-word-list">
          <p className="word-list-title">
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

      {/* Table */}
      {renderTable()}
    </div>
  );
};

export default TableCompletionBlock;
