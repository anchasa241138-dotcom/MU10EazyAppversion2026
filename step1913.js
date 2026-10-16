const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const openCert = js.lastIndexOf('openCertifyModal', s);
const genSub = js.lastIndexOf('generateSubmissionPDF', s);
const genCert = js.lastIndexOf('generateCertificatePDF', s);
console.log("openCertifyModal", openCert);
console.log("generateSubmissionPDF", genSub);
console.log("generateCertificatePDF", genCert);
console.log("s", s);