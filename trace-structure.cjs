const fs = require('fs');
const content = fs.readFileSync('src/data/IELTS/mocks/telc-b2-mock-1.json', 'utf8');

let depth = 0;
let inString = false;
let escape = false;
let key = '';
let parsingKey = true;
let lineNum = 1;

console.log('=== Parsing Structure ===\n');

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (char === '\n') {
        lineNum++;
        continue;
    }
    
    if (escape) {
        escape = false;
        continue;
    }
    
    if (char === '\\') {
        escape = true;
        continue;
    }
    
    if (char === '"') {
        inString = !inString;
        continue;
    }
    
    if (inString) continue;
    
    // Track depth changes
    if (char === '[') {
        depth++;
        console.log(`${lineNum}: DEPTH ${depth} - [ OPEN (key: "${key}")`);
    } else if (char === ']') {
        console.log(`${lineNum}: DEPTH ${depth} - ] CLOSE`);
        depth--;
    } else if (char === '{') {
        depth++;
        console.log(`${lineNum}: DEPTH ${depth} - { OPEN`);
    } else if (char === '}') {
        console.log(`${lineNum}: DEPTH ${depth} - { CLOSE`);
        depth--;
    }
    
    // Track key vs value
    if (char === ':') {
        parsingKey = false;
    } else if (char === ',' || char === '{' && !parsingKey) {
        parsingKey = true;
        key = '';
    }
    
    // Simple key tracking for debugging
    if (parsingKey && char.match(/[a-zA-Z]/)) {
        key += char;
    }
}

console.log('\n=== End of parsing, depth =', depth, '===');