const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const prevFunction = js.substring(0, s).match(/(\w+)\s*\([^)]*\)\s*\{/g);
console.log(prevFunction ? prevFunction[prevFunction.length - 1] : 'Not found');