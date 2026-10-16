const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const startIdx = js.indexOf('generateCertificatePDF');
const s1 = js.indexOf("if (sample.form_type === 'MU.10-001') {", startIdx);
const e1 = js.indexOf("} else if (sample.form_type === 'MU.10-002') {", s1);
const content = js.substring(s1, e1);

const bgMatches = content.match(/cert-pdf-border/g);
console.log("cert-pdf-border found in MU.10-001:", bgMatches);

if(bgMatches) {
    const s2 = content.indexOf('.cert-pdf-border');
    console.log("Context:", content.substring(Math.max(0, s2-100), s2+200));
}