const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('<!-- HEADER -->');
console.log(js.substring(s-400, s));