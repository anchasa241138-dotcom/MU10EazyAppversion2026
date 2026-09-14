const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

const match = lines.findIndex(l => l.includes('verifyAcceptModal'));
if (match > -1) {
    for(let i = 0; i < lines.length; i++) {
        if(lines[i].includes('verifyAcceptModal') || lines[i].includes('openVerifyAcceptModal')) {
            console.log(`${i+1}: ${lines[i]}`);
        }
    }
}
