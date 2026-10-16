const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/sample\.form_type === 'MU\.10-004'/g, "(sample.form_type === 'MU.10-004' || sample.form_type === 'MU.10-005')");

fs.writeFileSync('app_v83.js', js);
console.log("Updated MU.10-005 to use portrait sizing like MU.10-004");