const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('generateSubmissionPDF(e)'));
if (match > -1) {
    for(let i = match + 150; i < match + 200; i++) {
        if(lines[i] && lines[i].includes('analyst')) console.log(`${i+1}: ${lines[i]}`);
    }
}
