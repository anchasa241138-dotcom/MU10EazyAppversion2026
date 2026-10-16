const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const prevFunction = js.substring(s-2000, s).match(/(\w+)\s*\([^)]*\)\s*\{/g);
console.log(prevFunction);