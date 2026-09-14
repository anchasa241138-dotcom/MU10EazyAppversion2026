const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let count = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="certificatePDFContainer"')) {
        count++;
        console.log(`Found at line ${i+1}`);
    }
}
console.log(`Total count: ${count}`);
