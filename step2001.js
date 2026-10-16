const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("async waitForPdfAssets(doc) {");
console.log(js.substring(s-1500, s));