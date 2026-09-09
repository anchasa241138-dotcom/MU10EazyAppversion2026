const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
for(let i = 2790; i < 2810; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
