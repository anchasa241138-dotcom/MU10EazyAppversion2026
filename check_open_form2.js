const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
let start = js.indexOf('const toggleField = (id, show) => {');
console.log(js.substring(start, start + 1500));