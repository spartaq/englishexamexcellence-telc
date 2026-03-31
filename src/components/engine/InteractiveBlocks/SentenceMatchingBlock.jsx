import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const SentenceMatchingBlock = ({ data, userAnswers, onUpdate, isReviewMode }) => {
  const options = data.options || [];
  const questions = data.questions || [];

  const handleSelect = (qId, letter) => {
    if (isReviewMode) return;
    onUpdate(qId, letter);
  };

  return (
    <div className="sentence-matching-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. THE OPTIONS BANK (A-K) */}
      <div className="options-bank" style={{ 
        background: '#f8fafc', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0' 
      }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Options Bank
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {options.map(opt => (
            <div key={opt.id} style={{ fontSize: '14px', display: 'flex', gap: '10px', lineHeight: '1.4' }}>
              <strong style={{ color: 'var(--lab-indigo)', minWidth: '15px' }}>{opt.id}.</strong>
              <span>{opt.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THE SENTENCE STEMS */}
      <div className="stems-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {questions.map((q) => {
          const userAnswer = userAnswers[q.id];
          const isCorrect = userAnswer === q.answer;

          return (
            <div key={q.id} style={{ 
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
                <span style={{ fontWeight: 800, color: 'var(--invictus-red)' }}>{q.id}</span>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '16px' }}>{q.text} ...</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isReviewMode && (
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isCorrect ? '#10b981' : '#ef4444' }}>
                    {isCorrect ? <CheckCircle size={20} /> : <div style={{display:'flex', alignItems:'center', gap: '4px'}}>Ans: {q.answer} <XCircle size={20} /></div>}
                  </span>
                )}
                
                <select 
                  value={userAnswer || ''} 
                  onChange={(e) => handleSelect(q.id, e.target.value)}
                  disabled={isReviewMode}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontWeight: 700,
                    cursor: isReviewMode ? 'default' : 'pointer',
                    background: isReviewMode && !isCorrect ? '#fef2f2' : 'white'
                  }}
                >
                  <option value="">Select</option>
                  {options.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.id}</option>
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
