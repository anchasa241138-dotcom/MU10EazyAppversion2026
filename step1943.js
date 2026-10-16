const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('.cert-pdf-border { background-image: url(');
const e = js.indexOf("')", s);
// s + 41 is the quote. s + 42 is 'd' in data.
const bgStr = js.substring(s + 42, e);

js = js.replace(bgStr, '${CERT_BG_BASE64}');

const topInsertion = "const CERT_BG_BASE64 = '" + bgStr + "';\n";
js = topInsertion + js;

fs.writeFileSync('app_v83.js', js);
console.log("Extracted properly!");