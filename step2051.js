const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('switchAuthTab(tab)');
const e = js.indexOf('},', s);
console.log(js.substring(s, e + 2));