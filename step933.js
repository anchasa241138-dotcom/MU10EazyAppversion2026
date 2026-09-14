const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('appendChild') && lines[i].includes('verifyAcceptModal')) {
        console.log(`${i+1}: ${lines[i]}`);
    }
}
