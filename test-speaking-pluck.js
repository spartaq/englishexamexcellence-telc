import { pluckRandom } from './src/utils/mockPlucker.js';

console.log('Testing pluckRandom("speaking"):');
const speakingTest = pluckRandom('speaking');
console.log('Full speaking test:', speakingTest);

console.log('\nNumber of parts:', speakingTest.parts.length);
speakingTest.parts.forEach((part, index) => {
    console.log(`\nPart ${index + 1}:`, part.title);
    console.log('Type:', part.type);
    console.log('Has prompts:', !!part.prompts);
    console.log('Has topics:', !!part.topics);
    console.log('Has topicCard:', !!part.topicCard);
    if (part.topics) {
        console.log('Number of topics:', part.topics.length);
    }
});