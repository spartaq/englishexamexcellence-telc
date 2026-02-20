// exerciseLibrary.js
import { generalMock1 } from './mocks/generalMock1';
// import { academicMock1 } from './mocks/academicMock1'; 

const allMocks = [generalMock1];

// This flattens everything into a searchable array
export const exerciseLibrary = {
  reading: allMocks.flatMap(mock => 
    mock.sections.flatMap(section => 
      section.passages.map(p => ({
        ...p,
        mockId: mock.id,
        skill: 'reading',
        sourceTitle: mock.title
      }))
    )
  ),
  listening: [], // Add logic to pull listening sections here
  writing: [],   // Add logic to pull writing prompts here
  vocabulary: [] // If you have specific vocab tasks
};

// Helper: Get a random exercise by skill
export const getRandomExercise = (skill) => {
  const pool = exerciseLibrary[skill];
  return pool[Math.floor(Math.random() * pool.length)];
};