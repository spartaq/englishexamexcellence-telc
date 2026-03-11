// src/components/engine/ResultScreen.jsx
import React from 'react';
import { Trophy, CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react';
import './ResultScreen.css';

const ResultScreen = ({ lesson, results, onClaim }) => {
  const hasIELTSScore = results.ieltsScore !== undefined && results.ieltsScore !== null;
  
  return (
    <div className="results-container">
      <div className="results-card">
        <h2 className="results-title">{results.accuracy === 100 ? 'Perfect!' : 'Complete!'}</h2>
        
        {/* IELTS Band Score Display */}
        {hasIELTSScore && (
          <div className="ielts-band-display">
            <div className="ielts-band-header">
              <Star size={20} fill="#fbbf24" color="#fbbf24" />
              <span>IELTS Band Score</span>
            </div>
            <div className="ielts-band-value">
              {results.ieltsScore.band}
              {results.ieltsScore.isHalfBand && <span className="half-band">.5</span>}
            </div>
            <div className="ielts-band-description">
              {results.ieltsScore.description}
            </div>
            <div className="ielts-marks">
              {results.ieltsScore.rawMarks} / {results.ieltsScore.totalMarks} correct
              <span className="ielts-test-type">
                ({results.ieltsScore.testType === 'general' ? 'General Training' : 'Academic'})
              </span>
            </div>
          </div>
        )}
        
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
             <p>Tip: Review your answers to improve!</p>
           )}
        </div>

        <button className="claim-btn" onClick={onClaim}>Claim Rewards</button>
      </div>
    </div>
  );
};

export default ResultScreen;
