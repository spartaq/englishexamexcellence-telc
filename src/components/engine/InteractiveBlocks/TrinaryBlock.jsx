import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './TrinaryBlock.css';

export default function TrinaryBlock({ data, userAnswers, onUpdate, isReviewMode }) {
  const options = data.mode === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];

  // Handle both array of questions (original) and single question (from subtasks)
  const questions = data.questions || (data.text ? [data] : []);

  const handleSelect = (qId, value) => {
    if (isReviewMode) return;
    onUpdate(qId, value);
  };

  return (
    <div className="trinary-container">
      {/* Instruction Box */}
      {data.instruction && (
        <div style={{
          background: '#f1f5f9',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#334155',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
          border: '1px solid #e2e8f0'
        }}>
          {data.instruction}
        </div>
      )}
      
      {questions.map((q, idx) => {
        const userAnswer = userAnswers?.[q.id];
        const isCorrect = userAnswer === q.answer;

        return (
          <div 
            key={q.id || idx} 
            className={`trinary-row ${isReviewMode ? (isCorrect ? 'row-correct' : 'row-incorrect') : ''}`}
          >
            <div className="trinary-q-header">
              <p className="trinary-q">
                <span className="q-number">{q.id}.</span> {q.text}
              </p>
              {isReviewMode && (
                <span className="status-icon">
                  {isCorrect ? 
                    <CheckCircle size={20} color="#10b981" /> : 
                    <XCircle size={20} color="#ef4444" />
                  }
                </span>
              )}
            </div>

            <div className="trinary-button-group">
              {options.map(opt => {
                const isSelected = userAnswer === opt;
                const isTheRightAnswer = q.answer === opt;

                // Determine styling for review mode
                let stateClass = '';
                if (isReviewMode) {
                  if (isSelected && isCorrect) stateClass = 'btn-correct';
                  else if (isSelected && !isCorrect) stateClass = 'btn-wrong';
                  else if (isTheRightAnswer) stateClass = 'btn-should-have-been';
                } else if (isSelected) {
                  stateClass = 'active';
                }

                return (
                  <button 
                    key={opt}
                    className={`trinary-btn ${stateClass}`}
                    onClick={() => handleSelect(q.id, opt)}
                    disabled={isReviewMode}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}