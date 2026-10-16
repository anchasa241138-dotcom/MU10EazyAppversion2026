const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, viewOnly = false, forceEdit = false)');
const e = js.indexOf('enableEditApproval()', s);
const content = js.substring(s, e);
const m5 = content.indexOf('MU.10-005');
if (m5 !== -1) {
    console.log(content.substring(m5 - 100, m5 + 1000));
} else {
    console.log('MU.10-005 not found in openCertifyModal!');
}