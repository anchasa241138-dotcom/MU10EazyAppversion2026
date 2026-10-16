const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('generateCertificatePDF(sample');
console.log(js.substring(s+7000, s+8000));