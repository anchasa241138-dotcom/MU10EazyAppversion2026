const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('signaturePad = new SignaturePad'));
if (match > -1) {
    console.log(`${match+1}: ${lines[match]}`);
}
