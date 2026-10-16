const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('handleApproveReport(e) {');
const e = js.indexOf('// PDF Generation', s);
console.log(js.substring(s, e));