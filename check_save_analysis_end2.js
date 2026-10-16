const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('handleSaveAnalysis(e) {');
console.log(js.substring(pos + 5500, pos + 8000));