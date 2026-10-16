const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('htmlContent');
while (pos !== -1) {
    console.log('Found htmlContent at:', pos);
    console.log(js.substring(pos - 60, pos + 120));
    pos = js.indexOf('htmlContent', pos + 1);
}