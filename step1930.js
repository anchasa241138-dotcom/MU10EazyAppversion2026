const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('.cert-pdf-border { background-image: url(');
const e = js.indexOf('</style>', s);
const styleStr = js.substring(s, e);
fs.writeFileSync('bg_style.txt', '<style>' + styleStr + '</style>');
console.log("Extracted style block, length: " + styleStr.length);