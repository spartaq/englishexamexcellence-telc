import React from 'react';
import { Clock } from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import '../gamified/gamified.css';

const LessonTimer = ({ className = '' }) => {
  const activeSeconds = useExamStore((state) => state.activeSeconds);
  const isActive = useExamStore((state) => state.isActive);

  // Format seconds into MM:SS
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`xp-badge ${!isActive ? 'paused' : 'active-pulse'} ${className}`}>
      <Clock size={14} color="var(--xp-amethyst)" />
      <span>{formatTime(activeSeconds)}</span>
    </div>
  );
};

export default LessonTimer;
