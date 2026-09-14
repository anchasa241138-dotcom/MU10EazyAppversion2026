const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('id="certificatePDFContainer"'));
for(let i = start - 15; i < start + 15; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
