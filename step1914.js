const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const t = js.substring(0, s);
const lastFunc = t.lastIndexOf(') {');
console.log(t.substring(lastFunc - 50, lastFunc + 3));