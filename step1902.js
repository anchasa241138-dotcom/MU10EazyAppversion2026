const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
console.log(js.substring(s+5000, s+7000).replace(/\s+/g, ' '));