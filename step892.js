const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Certificate_') && lines[i].includes('.pdf')) {
        console.log(`Found Certificate_ at line ${i+1}: ${lines[i].trim()}`);
    }
}
