const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const searchString = "if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002' || sample.form_type === 'MU.10-003' || sample.form_type === 'MU.10-004') {";
const replaceString = "if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002' || sample.form_type === 'MU.10-003' || sample.form_type === 'MU.10-004' || sample.form_type === 'MU.10-005') {";
js = js.replace(searchString, replaceString);
fs.writeFileSync('app_v83.js', js);
console.log("Added MU.10-005 to signature dropdown logic!");