const fs = require('fs');
const js = fs.readFileSync('app_v83.js', 'utf8');
const idx = js.indexOf('handleRegister(e)');
console.log(js.substring(idx, idx + 1000));