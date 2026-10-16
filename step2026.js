const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');
const s = js.indexOf('formTypeChartInstance = new Chart');
console.log(js.substring(s, s + 1000));