const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if(l.includes('signature_pad') || l.includes('SignaturePad')) {
        console.log(`${i+1}: ${l}`);
    }
});
