import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';
import './ReflectionGate.css';

const CRITERIA = {
  WRITING: [
    "I have answered all parts of the prompt.",
    "I checked my spelling and basic grammar.",
    "I used transition words (However, Therefore, etc).",
    "I avoided repeating the same simple words."
  ],
  SPEAKING: [
    "I spoke at length without long pauses.",
    "I used a range of vocabulary.",
    "I focused on clear pronunciation.",
    "I answered the specific question asked."
  ],
  LISTENING: [
    "I identified why I missed specific answers.",
    "I checked for plural 's' and spelling errors.",
    "I understand the distractors used in the audio.",
    "I am ready to bank this XP."
  ]
};

const ReflectionGate = ({ isOpen, type, xpAmount, onClaim }) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const items = CRITERIA[type] || CRITERIA.WRITING;

  const toggleItem = (index) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const isComplete = checkedItems.length === items.length;

  if (!isOpen) return null;

  return (
    <div className="reflection-overlay">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="reflection-sheet"
      >
        <div className="reflection-header">
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#f0f4ff', padding: '12px', borderRadius: '50%' }}>
              <ShieldCheck color="#4f46e5" size={32} />
            </div>
          </div>
          <h2 className="reflection-title">The Self-Correction Gate</h2>
          <p className="reflection-subtitle">
            Reflect on your performance to unlock your <strong>{xpAmount} XP</strong>.
          </p>
        </div>

        <div className="check-list">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`check-item ${checkedItems.includes(index) ? 'checked' : ''}`}
              onClick={() => toggleItem(index)}
            >
              <div className="check-box">
                {checkedItems.includes(index) && <Check size={16} color="white" strokeWidth={4} />}
              </div>
              <span className="check-text">{item}</span>
            </div>
          ))}
        </div>

        <button 
          className={`claim-xp-btn ${isComplete ? 'ready' : ''}`}
          disabled={!isComplete}
          onClick={onClaim}
        >
          {isComplete ? <Sparkles size={20} /> : null}
          {isComplete ? "Claim My XP" : `Complete Audit (${checkedItems.length}/${items.length})`}
        </button>
      </motion.div>
    </div>
  );
};

export default ReflectionGate;