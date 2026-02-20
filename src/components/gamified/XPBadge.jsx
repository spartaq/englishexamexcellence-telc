import React from 'react';
import { Zap, Clock } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import './gamified.css';

const XPBadge = ({ mode = 'time' }) => {
  const totalXp = useExamStore((state) => state.totalXp);
  const activeSeconds = useExamStore((state) => state.activeSeconds);
  const isActive = useExamStore((state) => state.isActive);

  // Format seconds into MM:SS
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`xp-badge ${!isActive ? 'paused' : 'active-pulse'}`}>
      {mode === 'time' ? (
        <>
          <Clock size={14} color="var(--xp-amethyst)" />
          <span>{formatTime(activeSeconds)}</span>
        </>
      ) : (
        <>
          <Zap size={14} fill="var(--xp-amethyst)" color="var(--xp-amethyst)" />
          <span>{totalXp} XP</span>
        </>
      )}
    </div>
  );
};

export default XPBadge;