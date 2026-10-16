const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('.cert-pdf-border { background-image: url(');
console.log(js.substring(s, s+150));