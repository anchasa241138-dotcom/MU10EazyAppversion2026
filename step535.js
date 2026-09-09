const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if(l.includes('drawSignatureContainer')) {
        console.log(`${i+1}: ${l}`);
    }
});
