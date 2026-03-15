
export const evaluateDrill = (lesson, selectedTokens) => {
  // Handle token-select type - check if selected words are part of correct phrases
  if (lesson.type === 'token-select') {
    const correctPhrases = lesson.correctTokens || [];
    const selectedWords = selectedTokens || [];
    
    // Track which phrases are fully selected
    let correctCount = 0;
    let wrongCount = 0;
    const matchedPhrases = new Set();
    const selectedSet = new Set(selectedWords.map(w => w.toLowerCase()));
    
    // Check each phrase - if all its words are selected, it counts as correct
    correctPhrases.forEach(phrase => {
      const phraseWords = phrase.toLowerCase().split(/\s+/).filter(Boolean);
      if (phraseWords.length === 0) return;
      
      // Check if all words in phrase are selected
      const allWordsSelected = phraseWords.every(word => selectedSet.has(word));
      
      if (allWordsSelected) {
        matchedPhrases.add(phrase);
        correctCount++;
      }
    });
    
    // Wrong count = selected unique words that don't belong to any correct phrase
    wrongCount = selectedSet.size - correctCount;
    
    // Simple scoring (penalizing for wrong guesses prevents spamming)
    const score = Math.max(0, correctCount - (wrongCount * 0.5));
    const accuracy = Math.round((score / correctPhrases.length) * 100);
    
    return {
      accuracy: Math.min(accuracy, 100),
      isPerfect: accuracy >= 100,
      earnedXP: Math.round((lesson.xpReward) * (accuracy / 100))
    };
  }
  
  // 1. Clean the selected tokens (remove the "-index" suffix and punctuation)
  const cleanedSelection = selectedTokens.map(t => 
    t.split('-')[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
  );

  const correctOnes = lesson.correctTokens;
  
  // 2. Calculate matches
  const correctCount = cleanedSelection.filter(word => 
    correctOnes.includes(word)
  ).length;

  const wrongCount = cleanedSelection.length - correctCount;
  
  // 3. Simple IELTS-style scoring (penalizing for wrong guesses prevents spamming)
  const score = Math.max(0, correctCount - (wrongCount * 0.5));
  const accuracy = Math.round((score / correctOnes.length) * 100);

  return {
    accuracy: Math.min(accuracy, 100),
    isPerfect: accuracy >= 100,
    earnedXP: Math.round((lesson.xpReward) * (accuracy / 100))
  };
};