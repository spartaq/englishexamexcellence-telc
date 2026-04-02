import React, { useState, useMemo } from 'react';
import { Zap, Info } from 'lucide-react';
import './TokenSelectBlock.css';

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

    // determine new selection set based on current state
    const newSelections = selectedIndices.includes(index)
      ? selectedIndices.filter(i => i !== index)
      : [...selectedIndices, index];

    setSelectedIndices(newSelections);

    if (onUpdate) {
      const selectedWords = newSelections.map(idx => clean(tokens[idx]));
      onUpdate(selectedWords);
    }
  };

  return (
    <div className="token-select-block">
      
      {/* HEADER: Title & XP Reward */}
      <div className="token-select-header">
        <h3 className="token-select-title">
          {title || "Grammar Drill"}
        </h3>
        <div className="token-select-xp">
          <Zap size={14} fill="#d97706" /> {xpReward} XP
        </div>
      </div>

      {/* INSTRUCTION */}
      <div className="token-select-instruction">
        <Info size={18} className="token-select-instruction-icon" />
        <p className="token-select-instruction-text">
          {instruction}
        </p>
      </div>

      {/* INTERACTIVE TEXT AREA */}
      <div className="token-select-text-area">
        {tokens.map((token, i) => {
          const isSelected = selectedIndices.includes(i);
          const isActuallyCorrect = correctIndices.has(i);
          const isClickable = token.trim() !== "" && !/^[.,!\?;:]+$/.test(token);

          let className = 'token-select-token';
          if (isClickable && !isReviewMode) className += ' clickable';
          if (isSelected && !isReviewMode) className += ' selected';
          if (isReviewMode) {
            if (isSelected && isActuallyCorrect) className += ' review-correct';
            else if (isSelected && !isActuallyCorrect) className += ' review-incorrect';
            else if (!isSelected && isActuallyCorrect) className += ' review-missed';
          }

          return (
            <span key={i} onClick={() => toggleToken(i)} className={className}>
              {token}
            </span>
          );
        })}
      </div>

      {/* Results legend - shown in review mode */}
      {isReviewMode && (
        <div className="token-select-legend">
           <div className="token-select-legend-item">
              <div className="token-select-legend-color correct" /> Correct
           </div>
           <div className="token-select-legend-item">
              <div className="token-select-legend-color incorrect" /> Incorrect
           </div>
           <div className="token-select-legend-item">
              <div className="token-select-legend-color missed" /> Missed
           </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelectBlock;
