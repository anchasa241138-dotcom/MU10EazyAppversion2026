const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
for(let i = 2800; i < 2820; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
