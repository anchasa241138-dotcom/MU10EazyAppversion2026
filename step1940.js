const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('.cert-pdf-border { background-image: url(');
const e = js.indexOf("')", s);
const bgStr = js.substring(s + 41, e);

js = js.replace(bgStr, '${CERT_BG_BASE64}');

const topInsertion = "const CERT_BG_BASE64 = '" + bgStr + "';\n";
js = topInsertion + js;

fs.writeFileSync('app_v83.js', js);
console.log("Extracted base64 to top constant.");