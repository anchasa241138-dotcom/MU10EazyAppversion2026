const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = 1163374;
// Let's find where MU.10-004 ends!
let mu04End = js.indexOf("} else if (sample.form_type === 'MU.10-006')", pos);
console.log('mu04End pos:', mu04End);
if (mu04End !== -1) {
    console.log(js.substring(mu04End - 100, mu04End + 200));
}