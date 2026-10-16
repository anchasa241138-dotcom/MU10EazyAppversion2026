const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, viewOnly = false, forceEdit = false)');
const e = js.indexOf('enableEditApproval()', s);
const content = js.substring(s, e);
const m4 = content.indexOf('MU.10-004');
if (m4 !== -1) {
    console.log(content.substring(m4 - 100, m4 + 1000));
} else {
    console.log('MU.10-004 not found in openCertifyModal!');
}