const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s1 = js.indexOf('handleSaveAnalysis(e)');
const str = js.substring(s1, s1+5000);
console.log(str.indexOf('MU.10-004'));
fs.writeFileSync('temp2.txt', str);