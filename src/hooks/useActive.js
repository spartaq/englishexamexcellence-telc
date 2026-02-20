import { useEffect } from 'react';
import { useExamStore } from '../store/useExamStore';

export const useActive = () => {
  const setIsActive = useExamStore((state) => state.setIsActive);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [setIsActive]);
};