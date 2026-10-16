const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const idx = js.indexOf('.cert-pdf-border { background-image: url(');
console.log(js.substring(idx-100, idx+150));