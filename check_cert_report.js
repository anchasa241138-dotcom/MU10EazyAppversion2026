const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderCertifyDynamicReport(');
if (pos === -1) pos = js.indexOf('renderCertifyDynamicReport');
console.log('pos:', pos);
if (pos !== -1) {
    console.log(js.substring(pos, pos + 2500));
}