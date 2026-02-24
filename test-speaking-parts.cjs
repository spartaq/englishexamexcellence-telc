const fs = require('fs');
const path = require('path');

// Mock the ES module require
const { speakingMock1 } = require('./src/data/IELTS/speaking/mocks/ielts-speaking-mock1.js');
const { speakingMock2 } = require('./src/data/IELTS/speaking/mocks/ielts-speaking-mock2.js');
const { speakingMock3 } = require('./src/data/IELTS/speaking/mocks/ielts-speaking-mock3.js');
const { speakingMock4 } = require('./src/data/IELTS/speaking/mocks/ielts-speaking-mock4.js');
const { speakingMock5 } = require('./src/data/IELTS/speaking/mocks/ielts-speaking-mock5.js');

const allSpeakingMocks = [
  speakingMock1,
  speakingMock2,
  speakingMock3,
  speakingMock4,
  speakingMock5
];

function getRandomItem(arr) {
  return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;
}

function testPluckRandom() {
  console.log('Testing all speaking mocks:');
  allSpeakingMocks.forEach((mock, index) => {
    console.log(`\nMock ${index + 1}: ${mock.title}`);
    console.log(`Number of parts: ${mock.parts.length}`);
    
    mock.parts.forEach((part, partIndex) => {
      console.log(`  Part ${partIndex + 1}: ${part.title}`);
      console.log(`    Type: ${part.type}`);
      console.log(`    Has prompts: ${!!part.prompts}`);
      console.log(`    Has topics: ${!!part.topics}`);
      console.log(`    Has topicCard: ${!!part.topicCard}`);
      
      if (part.topics) {
        console.log(`    Number of topics: ${part.topics.length}`);
        part.topics.forEach((topic, topicIndex) => {
          console.log(`      Topic ${topicIndex + 1}: ${topic.topic}`);
          if (topic.questions) {
            console.log(`      Number of questions: ${topic.questions.length}`);
          }
        });
      }
    });
  });
}

testPluckRandom();