const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for (let i = 1870; i < 1890; i++) {
    if (lines[i].includes('accept-sample-name-display')) {
        console.log(`${i+1}: ${lines[i]}`);
    }
}
