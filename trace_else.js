const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = 1183985;
// Find the else block after MU.10-008 or MU.10-005
let elseBlock = js.indexOf("} else {", pos);
console.log('elseBlock pos:', elseBlock);
console.log(js.substring(elseBlock - 100, elseBlock + 500));