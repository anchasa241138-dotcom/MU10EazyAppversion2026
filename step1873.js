const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const matches = [...js.matchAll(/MU\.10-005/g)];
const m = matches[6];
console.log(js.substring(m.index - 50, m.index + 800));