const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');
const s = js.indexOf('// 3. Calculate Form type distribution');
const e = js.indexOf('function updateSubstanceCharts');
console.log(js.substring(s, e));