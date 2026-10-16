const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let mu06Pos = js.indexOf("form_type === 'MU.10-006'", pos);
console.log(js.substring(mu06Pos - 20, mu06Pos + 2500));