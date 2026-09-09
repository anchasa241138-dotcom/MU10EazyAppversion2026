const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = 2951;
for(let i = match - 10; i < match + 5; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
