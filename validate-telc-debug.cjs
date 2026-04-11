const fs = require('fs');
const content = fs.readFileSync('src/data/IELTS/mocks/telc-b2-mock-1.json', 'utf8');

// Simple bracket tracking
const stack = [];
let inString = false;
let escape = false;

let lastOpen = null;
let errorPos = -1;

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
        if (stack.length > 1000) {
            console.log('Stack too deep, something is wrong. Last 5:');
            console.log(stack.slice(-5));
            process.exit(1);
        }
    } else if (char === ']' || char === '}') {
        if (stack.length === 0) {
            console.log(`ERROR: Unmatched ${char} at position ${i}, line ${content.substring(0, i).split('\n').length}`);
            console.log('Context:', content.substring(Math.max(0, i-50), i+50));
            errorPos = i;
            break;
        }
        const open = stack[stack.length - 1];
        const matching = (open.char === '[' && char === ']') || (open.char === '{' && char === '}');
        if (!matching) {
            console.log(`ERROR: Mismatched brackets at position ${i}, line ${content.substring(0, i).split('\n').length}`);
            console.log(`Expected ${open.char === '[' ? ']' : '}'} but found ${char}`);
            console.log('Last opened at:', open.line, 'pos', open.pos);
            // Show what's at those positions
            console.log('Char at open:', JSON.stringify(content.substring(open.pos, open.pos+10)));
            console.log('Char at error:', JSON.stringify(content.substring(i-5, i+5)));
            errorPos = i;
            break;
        }
        lastOpen = stack.pop();
    }
}

if (errorPos >= 0) {
    console.log('\n=== Final stack (remaining unclosed) ===');
    for (let i = Math.max(0, stack.length - 10); i < stack.length; i++) {
        console.log(`[${i}] ${stack[i].char} at line ${stack[i].line}, pos ${stack[i].pos}`);
    }
    console.log('\n=== Context around error ===');
    console.log(content.substring(Math.max(0, errorPos - 200), Math.min(content.length, errorPos + 200)));
} else if (stack.length > 0) {
    console.log('ERROR: Unclosed brackets:', stack.map(s => `${s.char} at line ${s.line}`));
} else {
    console.log('JSON structure looks valid!');
}