const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let elsePos = js.indexOf('} else {', pos + 25000);
console.log('elsePos:', elsePos);
console.log(js.substring(elsePos, elsePos + 1500));