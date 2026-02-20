export const calculateScore = (lesson, aggregatedAnswers) => {
  let totalPoints = 0;
  let earnedPoints = 0;

  lesson.passages.forEach((passage) => {
    const userAns = aggregatedAnswers[passage.id];

    if (passage.type === 'mcq') {
      totalPoints++;
      if (userAns === passage.answer) earnedPoints++;
    } 
    
    else if (passage.type === 'trinary' || passage.type === 'short-answer' || passage.type === 'matching-info') {
      // passage.questions is an array of { id, answer }
      passage.questions?.forEach((q) => {
        totalPoints++;
        if (userAns && userAns[q.id] === q.answer) {
          earnedPoints++;
        }
      });
    }
    
    else if (passage.type === 'heading-match') {
      // passage.answers looks like { A: 0, B: 2 }
      Object.keys(passage.answers).forEach(paraId => {
        totalPoints++;
        if (userAns && userAns[paraId] == passage.answers[paraId]) {
          earnedPoints++;
        }
      });
    } 
    
    else if (passage.type === 'gap-fill') {
      // passage.answers looks like ["word1", "word2"]
      passage.answers?.forEach((correctWord, index) => {
        totalPoints++;
        if (userAns && userAns[index] === correctWord) {
          earnedPoints++;
        }
      });
    }
  });

  return {
    accuracy: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
    earnedPoints,
    totalPoints
  };
};