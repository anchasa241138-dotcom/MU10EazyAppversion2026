const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
let start = js.indexOf('openFormEditor(formType) {');
console.log(js.substring(start, start + 3000));