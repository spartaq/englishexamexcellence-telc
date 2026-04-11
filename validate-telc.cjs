const fs = require('fs');
const content = fs.readFileSync('src/data/IELTS/mocks/telc-b2-mock-1.json', 'utf8');

// Simple bracket tracking
const stack = [];
let inString = false;
let escape = false;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
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
    
    if (char === '[' || char === '{') {
        stack.push({ char, pos: i, line: content.substring(0, i).split('\n').length });
    } else if (char === ']' || char === '}') {
        if (stack.length === 0) {
            console.log(`ERROR: Unmatched ${char} at position ${i}, line ${content.substring(0, i).split('\n').length}`);
            console.log('Context:', content.substring(Math.max(0, i-50), i+50));
            process.exit(1);
        }
        const open = stack.pop();
        const matching = (open.char === '[' && char === ']') || (open.char === '{' && char === '}');
        if (!matching) {
            console.log(`ERROR: Mismatched brackets at position ${i}, line ${content.substring(0, i).split('\n').length}`);
            console.log(`Expected ${open.char === '[' ? ']' : '}'} but found ${char}`);
            console.log('Last opened:', open);
            console.log('Context:', content.substring(Math.max(0, i-50), i+50));
            process.exit(1);
        }
    }
}

if (stack.length > 0) {
    console.log('ERROR: Unclosed brackets:', stack);
    process.exit(1);
}

console.log('JSON structure looks valid!');