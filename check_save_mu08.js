const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('handleSaveAnalysis(e) {');
let mu08 = js.indexOf("sample.form_type === 'MU.10-008'", pos);
console.log(js.substring(mu08 - 20, mu08 + 2000));