const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisTable() {');
console.log(js.substring(pos, pos + 2500));