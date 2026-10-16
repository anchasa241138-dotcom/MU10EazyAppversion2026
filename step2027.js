const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf("case 'MU.10-002':");
console.log(js.substring(s, s + 1000));