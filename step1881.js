const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const endS = js.indexOf('const opt = {', s);
const txt = js.substring(s, endS);
const lastElseIndex = txt.lastIndexOf('} else {');
console.log(txt.substring(lastElseIndex - 500, lastElseIndex + 50));