const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let startIdx = js.indexOf("} else if (sample.form_type === 'MU.10-006') {", pos);
let endIdx = js.indexOf("} else if (sample.form_type === 'MU.10-008') {", startIdx);

console.log('Found MU.10-006 block in renderAnalysisDynamicSection:');
console.log('Start:', startIdx, 'End:', endIdx);
console.log(js.substring(startIdx, startIdx + 300));