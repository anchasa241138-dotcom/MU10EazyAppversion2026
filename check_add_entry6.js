const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
let start = js.indexOf("else if (formType === 'MU.10-002')");
console.log(js.substring(start, start + 3000));