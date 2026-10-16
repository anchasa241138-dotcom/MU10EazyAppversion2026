const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');
const s = js.indexOf('formTypeChartInstance = new Chart');
const e = js.indexOf('}', s + 500);
console.log(js.substring(s, e + 200));