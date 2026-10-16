const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const matches = [...js.matchAll(/(\w+)\s*\([^)]*\)\s*\{/g)];
const keys = matches.map(m => m[1]);
fs.writeFileSync('keys.txt', keys.join('\n'));