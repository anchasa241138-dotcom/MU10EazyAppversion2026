const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('let htmlContent =');
const lines = js.substring(s-10000, s).split('\n');
lines.forEach(l => {
    if (l.match(/^\s*\w+\s*\([^)]*\)\s*\{/)) console.log(l.trim());
});