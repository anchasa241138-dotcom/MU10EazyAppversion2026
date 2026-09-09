const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = 2636;
for(let i = match + 15; i < match + 35; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
