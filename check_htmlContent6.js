const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf("} else if (sample.form_type === 'MU.10-006') {");
console.log(js.substring(pos + 2000, pos + 6000));