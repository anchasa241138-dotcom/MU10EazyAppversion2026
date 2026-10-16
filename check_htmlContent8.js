const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf("} else if (sample.form_type === 'MU.10-008') {");
console.log(js.substring(pos + 6000, pos + 9000));