import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const SentenceMatchingBlock = ({ data, userAnswers, onUpdate, isReviewMode }) => {
  // Format: beginnings (sentence starts) + options (full sentence endings)
  // questions array maps beginnings to options with full text answer
  const questions = data.questions || [];
  const options = data.options || [];

  const handleSelect = (qId, selectedText) => {
    if (isReviewMode) return;
    onUpdate(qId, selectedText);
  };

  return (
    <div className="sentence-matching-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. THE OPTIONS BANK - Full sentence endings */}
      <div className="options-bank" style={{ 
        background: '#f8fafc', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0' 
      }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sentence Endings
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {options.map((opt, idx) => (
            <div key={idx} style={{ fontSize: '14px', display: 'flex', gap: '10px', lineHeight: '1.4' }}>
              <strong style={{ color: 'var(--lab-indigo)', minWidth: '20px' }}>{idx + 1}.</strong>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THE SENTENCE STEMS - Beginnings */}
      <div className="stems-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {questions.map((q) => {
          const qId = q.id;
          const userAnswer = userAnswers[qId];
          const correctAnswer = q.answer;
          const isCorrect = userAnswer === correctAnswer;

          return (
            <div key={qId} style={{ 
              background: 'white', 
              padding: '16px', 
              borderRadius: '12px', 
              border: '1px solid',
              borderColor: isReviewMode ? (isCorrect ? '#10b981' : '#ef4444') : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 800, color: 'var(--invictus-red)' }}>{qId}</span>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '16px' }}>{q.text}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isReviewMode && (
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isCorrect ? '#10b981' : '#ef4444' }}>
                    {isCorrect ? <CheckCircle size={20} /> : <div style={{display:'flex', alignItems:'center', gap: '4px'}}>Ans: {correctAnswer} <XCircle size={20} /></div>}
                  </span>
                )}
                
                <select 
                  value={userAnswer || ''} 
                  onChange={(e) => handleSelect(qId, e.target.value)}
                  disabled={isReviewMode}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontWeight: 700,
                    cursor: isReviewMode ? 'default' : 'pointer',
                    background: isReviewMode && !isCorrect ? '#fef2f2' : 'white',
                    minWidth: '200px'
                  }}
                >
                  <option value="">Select ending...</option>
                  {options.map((opt, idx) => (
                    <option key={idx} value={opt}>{idx + 1}. {opt}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SentenceMatchingBlock;
