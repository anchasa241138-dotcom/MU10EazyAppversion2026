const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('img.onload = () => {'));
if (match > -1) {
    for(let i = match - 5; i < match + 15; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
