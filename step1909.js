const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('const PERSON_DATA = {');
console.log(js.substring(s+2000, s+4000));