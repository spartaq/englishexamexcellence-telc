import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useExamStore = create(
  persist(
    (set) => ({  
      xp: 0,
      isPremium: false,
      totalXp: 1250,        // The user's lifetime earnings
      activeSeconds: 0,    // Time spent on the current task
      isActive: true,
      vocabProgress: {}, // Format: { "Sustainability": { level: 1, nextReview: timestamp } }
      masteryDates: {}, // Format: { "Sustainability": timestamp } - when word was mastered (level 3+)
      masteryHistory: [], // Format: [{ term, level, date }] - history of mastery events for timeline
      srsTestMode: false, // When true, use seconds instead of days for testing

      updateVocabMastery: (term, difficulty) => set((state) => {
        const current = state.vocabProgress[term] || { level: 0 };
        let newLevel = current.level;
        
        // SRS Algorithm (Leitner-inspired)
        // NOTE: This is TEMPORARY testing behavior!
        // In production, the real algorithm will be:
        // 'easy' = +1 level (needs 3 clicks to master)
        // 'good' = +0.5 level
        // 'hard' = -1 level (min 0)
        // Current simplified version for testing:
        // 'easy' = mastered (set to level 3+)
        // 'good' = mild success (+1 level)
        // 'hard' = failure (-1 level, min 0)
        if (difficulty === 'easy') newLevel = Math.max(3, newLevel + 1);
        if (difficulty === 'good') newLevel += 1;
        if (difficulty === 'hard') newLevel = Math.max(0, newLevel - 1);

        // Calculate next review based on floor of level
        // Level 0 = immediate, 1 = 1 day, 2 = 3 days, 3 = 7 days, 4 = 14 days, 5 = 30 days
        // In test mode, use seconds instead of days for faster testing
        const intervals = state.srsTestMode 
          ? [0, 5, 15, 30, 60, 120] // seconds for testing
          : [0, 1, 3, 7, 14, 30]; // days for production
        const intervalIndex = Math.min(Math.floor(newLevel), intervals.length - 1);
        const timeToAdd = intervals[intervalIndex];
        const nextReview = state.srsTestMode 
          ? Date.now() + timeToAdd * 1000 // seconds to milliseconds
          : Date.now() + timeToAdd * 24 * 60 * 60 * 1000; // days to milliseconds

        // Track mastery date when word reaches level 3+ for the first time
        const newMasteryDates = { ...state.masteryDates };
        const newMasteryHistory = [...state.masteryHistory];
        
        if (newLevel >= 3 && !state.masteryDates[term]) {
          newMasteryDates[term] = Date.now();
          newMasteryHistory.push({
            term,
            level: newLevel,
            date: Date.now()
          });
        }

        return {
          vocabProgress: {
            ...state.vocabProgress,
            [term]: { level: newLevel, nextReview }
          },
          masteryDates: newMasteryDates,
          masteryHistory: newMasteryHistory
        };
      }),
      
      // Action to upgrade (you'd call this after a successful payment)
      setPremium: (status) => set({ isPremium: status }),
      // Add the fixed reward when the task is finished
      claimXp: (amount) => set((state) => ({ 
        totalXp: state.totalXp + amount,
        activeSeconds: 0 // Reset timer for next task
      })),

      addSecond: () => set((state) => ({ 
        activeSeconds: state.activeSeconds + 1 
      })),

      setIsActive: (status) => set({ isActive: status }),

      // Current view for ScrollToTop component
      currentView: 'ieltsHub',
      setCurrentView: (view) => set({ currentView: view }),
      
      // SRS Test Mode controls
      toggleSrsTestMode: () => set((state) => ({ srsTestMode: !state.srsTestMode })),
      resetVocabProgress: () => set({ vocabProgress: {}, masteryDates: {}, masteryHistory: [] }),
    }),
    {
      name: 'exam-store',
      partialize: (state) => ({ 
        vocabProgress: state.vocabProgress,
        masteryDates: state.masteryDates,
        masteryHistory: state.masteryHistory,
        totalXp: state.totalXp 
      }),
    }
  )
);
