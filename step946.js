const fs = require('fs');
let js = fs.readFileSync('app_v51.js', 'utf8');
const lines = js.split('\n');

const match = lines.findIndex(l => l.includes('openCertifyModal(refId'));
if (match > -1) {
    for (let i = match + 120; i < match + 200; i++) {
        if(lines[i] && (lines[i].includes('receiveDate') || lines[i].includes('analysisDate'))) {
            console.log(`${i+1}: ${lines[i]}`);
        }
    }
}
