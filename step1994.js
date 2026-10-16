const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('handleApproveReport(e) {');
console.log(js.substring(s, s+1500));