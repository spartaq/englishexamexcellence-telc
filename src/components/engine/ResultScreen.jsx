// src/components/engine/ResultScreen.jsx
import React from 'react';
import { Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import './ResultScreen.css';

const ResultScreen = ({ lesson, results, onClaim }) => {
  return (
    <div className="results-container">
      <div className="results-card">
        <h2 className="results-title">{results.accuracy === 100 ? 'Perfect!' : 'Complete!'}</h2>
        
        <div className="results-stats">
          <div className="stat-item">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{results.accuracy}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">XP Earned</span>
            <span className="stat-value text-indigo">+{results.earnedXP}</span>
          </div>
        </div>

        <div className="answer-review">
           {/* Logic to show which words were missed */}
           {results.accuracy < 100 && (
             <p>Tip: Look for the auxiliary verb 'have' or 'has'!</p>
           )}
        </div>

        <button className="claim-btn" onClick={onClaim}>Claim Rewards</button>
      </div>
    </div>
  );
};

export default ResultScreen;