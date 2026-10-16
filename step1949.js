const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const matches = [...js.matchAll(/\.cert-pdf-border\s*\{/g)];
console.log(matches.map(m => m.index));