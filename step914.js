const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for (let i = 3750; i < 3900; i++) {
    if (lines[i] && lines[i].includes('save(')) {
        console.log(`${i+1}: ${lines[i]}`);
    }
}
