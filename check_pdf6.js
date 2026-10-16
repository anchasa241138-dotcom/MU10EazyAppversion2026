const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let start = js.indexOf('generateSubmissionPDF(e) {');
console.log(js.substring(start + 18000, start + 24000));