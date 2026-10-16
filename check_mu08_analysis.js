const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let mu08Pos = js.indexOf("form_type === 'MU.10-008'", pos);
console.log(js.substring(mu08Pos - 20, mu08Pos + 1000));