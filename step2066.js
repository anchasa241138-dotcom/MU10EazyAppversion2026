const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('initData() {');
const e = js.indexOf('saveSamples()', s);
console.log(js.substring(s, e));