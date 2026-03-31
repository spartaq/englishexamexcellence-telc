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

      updateVocabMastery: (term, difficulty) => set((state) => {
        const current = state.vocabProgress[term] || { level: 0 };
        let newLevel = current.level;
        
        // SRS Algorithm (Leitner-inspired)
        // 'easy' = full success (+1 level)
        // 'good' = mild success (+0.5 level)
        // 'hard' = failure (-1 level, min 0)
        if (difficulty === 'easy') newLevel += 1;
        if (difficulty === 'good') newLevel += 0.5;
        if (difficulty === 'hard') newLevel = Math.max(0, newLevel - 1);

        // Calculate next review based on floor of level
        // Level 0 = immediate, 1 = 1 day, 2 = 3 days, 3 = 7 days, 4 = 14 days, 5 = 30 days
        const intervals = [0, 1, 3, 7, 14, 30]; 
        const intervalIndex = Math.min(Math.floor(newLevel), intervals.length - 1);
        const daysToAdd = intervals[intervalIndex];
        const nextReview = Date.now() + daysToAdd * 24 * 60 * 60 * 1000;

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
