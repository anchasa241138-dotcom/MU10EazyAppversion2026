const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('s1.disabled'));
if (match > -1) {
    for(let i = match - 10; i < match + 30; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
