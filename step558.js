const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('const renderSignatureSlot'));
for (let i = match; i > 0; i--) {
    if (lines[i].match(/^[a-zA-Z0-9_]+\s*\(/)) {
        console.log(`Found function at ${i+1}: ${lines[i]}`);
        break;
    }
}
