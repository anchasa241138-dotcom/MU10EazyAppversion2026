const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('handleSaveAnalysis(e) {');
console.log(js.substring(pos + 3000, pos + 5500));