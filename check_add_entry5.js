const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
let start = js.indexOf('addGlobalSampleEntry() {');
console.log(js.substring(start + 16000, start + 21000));