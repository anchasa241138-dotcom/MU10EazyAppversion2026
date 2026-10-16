const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const startIdx = js.indexOf('renderAnalysisDynamicSection(sample) {');
const str = js.substring(startIdx, startIdx + 15000); // Should cover the whole function
fs.writeFileSync('temp_render.txt', str);