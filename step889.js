const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const match = lines.findIndex(l => l.includes('id="certificatePDFContainer"'));
if (match > -1) {
    for(let i = match - 10; i < match; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
