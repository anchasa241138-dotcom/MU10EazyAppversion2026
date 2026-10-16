const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/sample\.form_type === 'MU\.10-005'\)/g, 'sample.form_type === \'MU.10-005\' || sample.form_type === \'MU.10-008\')');

fs.writeFileSync('app_v83.js', js);
console.log('Updated signature visibility for MU.10-008');