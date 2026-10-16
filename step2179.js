const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/ \|\| sample\.form_type === 'MU\.10-008'/g, '');

fs.writeFileSync('app_v83.js', js);
console.log('Removed MU.10-008 from portrait sizing');