const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
let start = js.indexOf("else if (formType === 'MU.10-002')");
console.log(js.substring(start + 2000, start + 4000));