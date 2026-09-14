const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for (let i = 3450; i < 3500; i++) {
    if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
