const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf("} else if (sample.form_type === 'MU.10-006') {");
while (pos !== -1) {
    console.log('Found MU.10-006 at:', pos);
    pos = js.indexOf("} else if (sample.form_type === 'MU.10-006') {", pos + 1);
}