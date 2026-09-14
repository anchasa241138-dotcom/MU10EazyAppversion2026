const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('openCertifyModal(refId'));
if (match > -1) {
    const end = match + 450;
    for(let i = match; i < end; i++) {
        if(lines[i] && lines[i].includes('MU.10-002')) {
            console.log(`${i+1}: ${lines[i]}`);
        }
    }
}
