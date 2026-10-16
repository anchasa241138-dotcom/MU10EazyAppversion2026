const fs = require('fs');

const buf = fs.readFileSync('cert_background_new.png');
const newB64 = 'data:image/png;base64,' + buf.toString('base64');

let js = fs.readFileSync('app_v83.js', 'utf8');

const regex = /const CERT_BG_BASE64 = '.*';/;
js = js.replace(regex, `const CERT_BG_BASE64 = '${newB64}';`);

fs.writeFileSync('app_v83.js', js);
console.log("Updated CERT_BG_BASE64 with cert_background_new.png");