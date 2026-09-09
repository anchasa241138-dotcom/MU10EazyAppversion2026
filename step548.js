const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
for(let i = 2710; i < 2720; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
