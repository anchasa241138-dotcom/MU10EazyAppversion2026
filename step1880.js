const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const endS = js.indexOf('const opt = {', s);
console.log(js.substring(s, endS).replace(/\s+/g, ' ').substring(0, 1500));
console.log('\n--- END ---\n');
console.log(js.substring(endS - 1000, endS).replace(/\s+/g, ' '));