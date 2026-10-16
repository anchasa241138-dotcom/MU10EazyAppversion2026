const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('cert-mu10-signatures');
console.log(js.substring(Math.max(0, s-200), s+300));