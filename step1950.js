const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const idx = 439060;
console.log(js.substring(idx-100, idx+200));