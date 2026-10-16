const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
if (pos === -1) pos = js.indexOf('renderAnalysisDynamicSection');
console.log(js.substring(pos, pos + 2000));