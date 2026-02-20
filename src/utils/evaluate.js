
export const evaluateDrill = (lesson, selectedTokens) => {
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