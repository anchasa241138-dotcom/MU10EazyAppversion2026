const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('openCertifyModal');
const e = js.indexOf('closeCertifyModal');
console.log(js.substring(s, e).match(/<select[^>]*>/g));