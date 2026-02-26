import React, { useState, useMemo } from 'react';
import { Zap, Info } from 'lucide-react'; // Assuming lucide-react is available

const TokenSelectBlock = ({ data, onUpdate, isReviewMode = false }) => {
  const { content, correctTokens, instruction, xpReward, title } = data;
  const [selectedIndices, setSelectedIndices] = useState([]);

  const clean = (word) => word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'„”]/g, "").toLowerCase().trim();

  // 1. TOKENIZE (Word-by-word)
  const tokens = useMemo(() => {
    return content.split(/(\s+|[\.,!\?;:])/).filter(Boolean);
  }, [content]);

  // 2. IDENTIFY CORRECT INDICES
  const correctIndices = useMemo(() => {
    const indices = new Set();
    correctTokens.forEach(phrase => {
      const phraseWords = phrase.split(/\s+/).map(clean);
      for (let i = 0; i <= tokens.length - phraseWords.length; i++) {
        let match = true;
        let tokenPointer = i;
        let matchedTokenIndices = [];
        for (let p = 0; p < phraseWords.length; p++) {
          while (tokenPointer < tokens.length && tokens[tokenPointer].trim() === "") tokenPointer++;
          if (tokenPointer < tokens.length && clean(tokens[tokenPointer]) === phraseWords[p]) {
            matchedTokenIndices.push(tokenPointer);
            tokenPointer++;
          } else {
            match = false;
            break;
          }
        }
        if (match) matchedTokenIndices.forEach(idx => indices.add(idx));
      }
    });
    return indices;
  }, [tokens, correctTokens]);

  const toggleToken = (index) => {
    if (isReviewMode) return;
    if (tokens[index].trim() === "" || /^[.,!\?;:]+$/.test(tokens[index])) return;
    
    let newSelections;
    setSelectedIndices(prev => {
      newSelections = prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
      return newSelections;
    });
    // Sync with parent if onUpdate is provided
    if (onUpdate && newSelections) {
      const selectedWords = newSelections.map(idx => clean(tokens[idx]));
      onUpdate(selectedWords);
    }
  };

  return (
    <div className="block-container" style={{ 
      background: 'white', 
      padding: '32px', 
      borderRadius: '24px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
    }}>
      
      {/* HEADER: Title & XP Reward */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {title || "Grammar Drill"}
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: '#fef3c7', 
          color: '#d97706', 
          padding: '6px 12px', 
          borderRadius: '100px', 
          fontSize: '0.85rem', 
          fontWeight: 700 
        }}>
          <Zap size={14} fill="#d97706" /> {xpReward} XP
        </div>
      </div>

      {/* INSTRUCTION */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        background: '#f1f5f9', 
        padding: '14px 18px', 
        borderRadius: '12px', 
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <Info size={18} style={{ color: '#64748b', marginTop: '2px', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>
          {instruction}
        </p>
      </div>

      {/* INTERACTIVE TEXT AREA */}
      <div className="natural-text-area" style={{ 
        lineHeight: '2.3', 
        fontSize: '1.2rem', 
        color: '#1e293b',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        marginBottom: '32px'
      }}>
        {tokens.map((token, i) => {
          const isSelected = selectedIndices.includes(i);
          const isActuallyCorrect = correctIndices.has(i);
          const isClickable = token.trim() !== "" && !/^[.,!\?;:]+$/.test(token);

          let style = {
            display: 'inline',
            padding: '2px 0',
            cursor: (isReviewMode || !isClickable) ? 'default' : 'pointer',
            borderRadius: '2px',
            transition: 'all 0.1s ease',
          };

          if (isReviewMode) {
            if (isSelected && isActuallyCorrect) {
              style.backgroundColor = '#dcfce7'; 
              style.color = '#15803d';
            } else if (isSelected && !isActuallyCorrect) {
              style.backgroundColor = '#fee2e2'; 
              style.color = '#b91c1c';
            } else if (!isSelected && isActuallyCorrect) {
              style.backgroundColor = '#fef9c3'; 
              style.boxShadow = '0 0 0 1px #facc15';
            }
          } else if (isSelected) {
            style.backgroundColor = '#e0e7ff';
            style.color = '#4338ca';
          }

          return (
            <span key={i} onClick={() => toggleToken(i)} style={style}>
              {token}
            </span>
          );
        })}
      </div>

      {/* Results legend - shown in review mode */}
      {isReviewMode && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          padding: '16px', 
          background: '#f8fafc', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          fontSize: '0.85rem' 
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#dcfce7', border: '1px solid #22c55e', borderRadius: '3px' }} /> Correct
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '3px' }} /> Incorrect
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#fef9c3', border: '1px solid #facc15', borderRadius: '3px' }} /> Missed
           </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelectBlock;