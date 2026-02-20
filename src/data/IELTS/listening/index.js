import { listeningMock1 } from './mocks/ielts-listening-mock1';

export const listeningMocks = {
  'listening-mock1': listeningMock1,
};

export const LISTENING_HUB = {
  title: "IELTS Listening Lab",
  description: "Train your ear for different accents.",
  categories: [
    {
      id: 'full-mocks',
      title: 'IELTS Listening Mock Exams',
      tasks: [
        { id: 'listening-mock1', title: 'IELTS Listening Mock #1', xp: 1500, type: 'LISTENING', tier: 'bronze' },
      ]
    }
  ]
};