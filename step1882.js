const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('cert-pdf-border');
console.log(js.substring(s-50, s+300));