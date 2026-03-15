import { useEffect, useRef } from 'react';
import { useExamStore } from '../store/useExamStore';

export const useXP = () => {
  const isActive = useExamStore(state => state.isActive);
  const addSecond = useExamStore(state => state.addSecond);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        addSecond();
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, addSecond]);
};