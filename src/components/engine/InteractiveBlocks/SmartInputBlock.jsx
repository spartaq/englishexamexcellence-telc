import React, { useState } from 'react';

export default function SmartInputBlock({ data, userAnswers, onUpdate }) {
  const [val, setVal] = useState(userAnswers?.[data.id] || "");
  const wordCount = val.trim().split(/\s+/).filter(x => x).length;
  const isOverLimit = wordCount > data.wordLimit;

  const handleChange = (e) => {
    const newVal = e.target.value;
    setVal(newVal);
    if (onUpdate) {
      onUpdate(data.id, newVal);
    }
  };

  return (
    <div className="smart-input-container">
      <p className="input-instruction">LIMIT: {data.wordLimit} WORDS</p>
      <input 
        className={`standard-input ${isOverLimit ? 'error' : ''}`}
        value={val}
        onChange={handleChange}
      />
      <span className="word-feedback">{wordCount}/{data.wordLimit} words</span>
    </div>
  );
}
