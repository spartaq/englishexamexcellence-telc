// ScrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useExamStore } from './store/useExamStore'; // Path to your Zustand store

const ScrollToTop = () => {
  // 1. Grab the state variable that changes when you "change pages"
  // If your state is just 'view', use that.
  const currentView = useExamStore((state) => state.currentView);

  useLayoutEffect(() => {
    // 2. Scroll to top instantly before the browser paints the new view
    window.scrollTo(0, 0);
  }, [currentView]); // 3. Re-run whenever this state changes

  return null; // This component doesn't render anything visual
};

export default ScrollToTop;