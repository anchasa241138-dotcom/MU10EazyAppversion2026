const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s1 = js.indexOf('certifyPdfPreview');
const s2 = js.indexOf('cert-dynamic-content');
console.log("certifyPdfPreview:", s1);
console.log("cert-dynamic-content:", s2);