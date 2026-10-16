const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let startIdx = js.indexOf("} else if (sample.form_type === 'MU.10-006') {", pos);
console.log('Start index in renderAnalysisDynamicSection:', startIdx);

let endIdx = js.indexOf("} else if (sample.form_type === 'MU.10-008') {", startIdx);
console.log('End index:', endIdx);
console.log(js.substring(startIdx, startIdx + 300));