const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('openCertifyModal(refId, viewOnly = false, forceEdit = false)'));
if (match > -1) {
    for(let i = match; i < match + 120; i++) {
        if(lines[i] && lines[i].includes('disabled')) console.log(`${i+1}: ${lines[i]}`);
        if(lines[i] && lines[i].includes('viewOnly')) console.log(`${i+1}: ${lines[i]}`);
        if(lines[i] && lines[i].includes('status ===')) console.log(`${i+1}: ${lines[i]}`);
    }
}
