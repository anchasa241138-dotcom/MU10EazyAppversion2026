const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('.cert-pdf-border { background-image: url(');
const e = js.indexOf("')", s);
const bgStr = js.substring(s + 41, e);
console.log("Length of base64 string:", bgStr.length);
const occurrences = js.split(bgStr).length - 1;
console.log("Occurrences:", occurrences);