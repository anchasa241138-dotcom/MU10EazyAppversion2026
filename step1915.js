const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const t = js.substring(s-5000, s);
const match = t.match(/async\s+\w+\s*\([^)]*\)\s*\{/g);
console.log(match);