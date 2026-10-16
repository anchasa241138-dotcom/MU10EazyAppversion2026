const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const searchStr = "if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002' || sample.form_type === 'MU.10-003' || sample.form_type === 'MU.10-004') {";
const replaceStr = "if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002' || sample.form_type === 'MU.10-003' || sample.form_type === 'MU.10-004' || sample.form_type === 'MU.10-005') {";

let count = 0;
js = js.split(searchStr).join(() => { count++; return replaceStr; });

fs.writeFileSync('app_v83.js', js);
console.log("Replaced " + count + " occurrences.");