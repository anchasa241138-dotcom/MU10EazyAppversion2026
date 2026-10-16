const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');
const s = js.indexOf('function updateSubstanceCharts(samples) {');
console.log(js.substring(s, s + 3000));