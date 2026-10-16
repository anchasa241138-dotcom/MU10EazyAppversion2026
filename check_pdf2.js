const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let start = js.indexOf('generateSubmissionPDF(e) {');
if (start === -1) start = js.indexOf('generateSubmissionPDF(');
console.log(js.substring(start, start + 3000));