const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf("htmlContent = `", 1100000);
let mu06Pos = js.lastIndexOf("} else if (sample.form_type === 'MU.10-006') {", pos);
console.log('mu06Pos:', mu06Pos);
console.log(js.substring(mu06Pos, mu06Pos + 4000));