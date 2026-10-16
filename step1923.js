const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, viewOnly = false, forceEdit = false)');
const e = js.indexOf('enableEditApproval()', s);
const content = js.substring(s, e);
const m4 = content.indexOf('if (sample.form_type === \'MU.10-004\')');
console.log(content.substring(m4, m4 + 4000));