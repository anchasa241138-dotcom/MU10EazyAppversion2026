const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = 2951;
for(let i = match - 80; i < match; i++) {
    if(lines[i] && lines[i].includes('btnApprove')) console.log(`${i+1}: ${lines[i]}`);
}
