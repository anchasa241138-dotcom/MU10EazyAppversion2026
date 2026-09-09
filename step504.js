const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('function renderSignatureSlot') || l.includes('const renderSignatureSlot'));
if (match > -1) {
    for(let i = match; i < match + 15; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
