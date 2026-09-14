const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for (let i = 2700; i < 2730; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
