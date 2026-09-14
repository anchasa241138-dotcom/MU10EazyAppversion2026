const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const start = lines.findIndex(l => l.includes('id="certificatePDFContainer"'));
if (start > -1) {
    let braceCount = 0;
    for(let i = start; i < lines.length; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
        if(lines[i].includes('<div')) braceCount += (lines[i].match(/<div/g) || []).length;
        if(lines[i].includes('</div')) braceCount -= (lines[i].match(/<\/div/g) || []).length;
        if(braceCount === 0) break;
    }
}
