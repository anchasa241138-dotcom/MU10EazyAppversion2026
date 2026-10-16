const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002' || sample.form_type === 'MU.10-003' || sample.form_type === 'MU.10-004') {", js.indexOf('handleApproveReport'));
console.log(js.substring(s, s+2000));