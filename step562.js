const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, i) => {
    if(l.includes('const mode = document.querySelector(\'input[name="pdfSignMode"]:checked\')?.value || \'system\';')) {
        console.log(`${i+1}: ${l}`);
    }
});
