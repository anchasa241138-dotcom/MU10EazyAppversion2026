const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('switchAuthTab');
const e = js.indexOf('}', s + 100);
console.log(js.substring(s, e + 50));