const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('const opt = {');
const e = js.indexOf('pagebreak:', s);

let optBlock = js.substring(s, e);
optBlock = optBlock.replace(/sample\.form_type === 'MU\.10-004'/g, "(sample.form_type === 'MU.10-004' || sample.form_type === 'MU.10-005')");

js = js.substring(0, s) + optBlock + js.substring(e);

fs.writeFileSync('app_v83.js', js);
console.log("Updated opt correctly.");