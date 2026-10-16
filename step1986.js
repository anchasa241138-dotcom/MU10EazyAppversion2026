const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("if(viewOnly || (sample.status === 'approved' && !forceEdit)) {");
console.log(js.substring(s, s+1500));