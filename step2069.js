const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('handleRegister(e)');
const e = js.indexOf('handleForgot(e)', s);
console.log(js.substring(s, e));