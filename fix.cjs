const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
// Fix the Next Passage button - remove the extra line break and fix indentation
c = c.replace('                                 Next Passage\n                                </button>', '                                 Next Passage</button>');
fs.writeFileSync('src/App.jsx', c);
console.log('Fixed');
