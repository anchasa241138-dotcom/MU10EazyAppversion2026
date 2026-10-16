const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('openAnalysisInputModal(refId) {');
console.log(js.substring(pos + 2000, pos + 4500));