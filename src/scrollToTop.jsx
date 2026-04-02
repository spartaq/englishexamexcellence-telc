// ScrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useExamStore } from './store/useExamStore'; // Path to your Zustand store

const ScrollToTop = () => {
  // 1. Grab the state variable that changes when you "change pages"
  // If your state is just 'view', use that.
  const currentView = useExamStore((state) => state.currentView);

  useLayoutEffect(() => {
    // 2. Scroll to top instantly before the browser paints the new view
    // Try to scroll the main container first (which has overflow-y: auto)
    const mainContainer = document.querySelector('.invictus-main-container');
    if (mainContainer) {
      mainContainer.scrollTo(0, 0);
    } else {
      // Fallback to window scroll
      window.scrollTo(0, 0);
    }
  }, [currentView]); // 3. Re-run whenever this state changes

  return null; // This component doesn't render anything visual
};

export default ScrollToTop;