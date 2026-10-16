const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("class=\"pdf-document cert-pdf-border\"");
console.log(js.substring(s, s+250));