const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, viewOnly = false, forceEdit = false)');
const e = js.indexOf('enableEditApproval()', s);
const content = js.substring(s, e);
const lines = content.split('\n');
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('container.')) {
        console.log(`Line ${i}: ${lines[i].trim()}`);
    }
}