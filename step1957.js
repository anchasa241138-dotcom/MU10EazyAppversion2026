const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('MU.10-004');
console.log(js.substring(s-100, s+500));