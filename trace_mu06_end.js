const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let mu06Start = 1179613;
let mu08Start = js.indexOf("} else if (sample.form_type === 'MU.10-008')", mu06Start);
console.log('mu08Start pos:', mu08Start);
console.log(js.substring(mu08Start - 100, mu08Start + 100));