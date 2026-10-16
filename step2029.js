const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');
const s = js.indexOf('// 3. Calculate Form type distribution');
console.log(js.substring(s, s + 1000));