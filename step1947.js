const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('const CERT_BG_BASE64 =');
const e = js.indexOf("';", s);
const b64 = js.substring(s+24, e);
fs.writeFileSync('test_bg.png', Buffer.from(b64, 'base64'));
console.log("Wrote test_bg.png");