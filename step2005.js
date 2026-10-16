const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const oldStr = "const pageOrientation = sample.form_type === 'MU.10-004' ? 'portrait' : 'landscape';";
const newStr = "const pageOrientation = (sample.form_type === 'MU.10-004' || sample.form_type === 'MU.10-005') ? 'portrait' : 'landscape';";

js = js.replace(oldStr, newStr);
fs.writeFileSync('app_v83.js', js);
console.log("Fixed page orientation for MU.10-005!");