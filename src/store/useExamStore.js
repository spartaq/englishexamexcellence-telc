import { create } from 'zustand';

export const useExamStore = create((set) => ({  
  xp: 0,
  isPremium: false,
  totalXp: 1250,        // The user's lifetime earnings
  activeSeconds: 0,    // Time spent on the current task
  isActive: true,
  vocabProgress: {}, // Format: { "Sustainability": { level: 1, nextReview: timestamp } }

  updateVocabMastery: (term, difficulty) => set((state) => {
    const current = state.vocabProgress[term] || { level: 0 };
    let newLevel = current.level;
    
    // Simple SRS Algorithm (Leitner-inspired)
    if (difficulty === 'easy') newLevel += 1;
    if (difficulty === 'hard') newLevel = Math.max(0, newLevel - 1);

    // Calculate next review (e.g., Level 1 = 1 day, Level 2 = 3 days, Level 3 = 7 days)
    const intervals = [0, 1, 3, 7, 14, 30]; 
    const daysToAdd = intervals[Math.min(newLevel, intervals.length - 1)];
    const nextReview = Date.now() + daysToAdd * 24 * 60 * 60 * 1000;

    return {
      vocabProgress: {
        ...state.vocabProgress,
        [term]: { level: newLevel, nextReview }
      }
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
}));