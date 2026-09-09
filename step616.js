const fs = require('fs');
let html = fs.readFileSync('style_v2.css', 'utf8');
const lines = html.split('\n');
const match = lines.findIndex(l => l.includes('.logo-container'));
if (match > -1) {
    for(let i = match; i < match + 15; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
