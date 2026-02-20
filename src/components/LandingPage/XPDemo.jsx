import React, { useState, useEffect, useRef } from 'react';

const XPDemo = () => {
  const [xp, setXp] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const startXP = () => {
    if (!isActive) {
      setIsActive(true);
      timerRef.current = setInterval(() => {
        setXp((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopXP = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="lab-card">
      <div className="card-header">
        <span className="task-label">Task: Paragraph Reorder</span>
        <div className={`status-indicator ${isActive ? 'active' : 'paused'}`}>
          {isActive ? 'XP MINTING' : 'XP PAUSED'}
        </div>
      </div>

      <div className="xp-monitor">
        <div className="xp-value">{xp.toString().padStart(2, '0')}</div>
        <div className="xp-sub">Current Session XP</div>
      </div>

      <div className="demo-content">
        <div className="demo-block">Scientists gathered the raw data...</div>
        <div className="demo-block italic">Analysis showed a 40% increase...</div>
      </div>

      <button 
        className="focus-btn"
        onMouseEnter={startXP}
        onMouseLeave={stopXP}
        onTouchStart={startXP}
        onTouchEnd={stopXP}
      >
        Hold to Simulate Focus
      </button>
      <p className="demo-footer">XP pauses the second you stop interacting.</p>
    </div>
  );
};

export default XPDemo;