import { listeningMock1 } from './mocks/ielts-listening-mock1';
import { listeningMock2 } from './mocks/ielts-listening-mock2';

export const listeningMocks = {
  'listening-mock1': listeningMock1,
  'listening-mock2': listeningMock2,
};

export const LISTENING_HUB = {
  title: "IELTS Listening Lab",
  description: "Train your ear for different accents.",
  categories: [
    {
      id: 'full-mocks',
      title: 'Full Listening Mocks',
      description: 'Complete IELTS Listening simulations',
      tasks: [
        { id: 'listening-mock1', title: 'Listening Mock #1', xp: 1500, type: 'LISTENING', tier: 'bronze' },
        { id: 'listening-mock2', title: 'Listening Mock #2', xp: 1500, type: 'LISTENING', tier: 'bronze' },
      ]
    }
  ]
};