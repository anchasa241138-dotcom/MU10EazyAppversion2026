const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let start = js.indexOf('generateSubmissionPDF(e) {');
console.log(js.substring(start + 12000, start + 18000));