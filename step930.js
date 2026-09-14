const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('#certificatePDFContainer')) {
        console.log(`${i+1}: ${lines[i]}`);
    }
}
