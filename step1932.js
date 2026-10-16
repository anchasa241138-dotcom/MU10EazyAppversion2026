const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/\\\`/g, "`").replace(/\\\$/g, "$$");
fs.writeFileSync('app_v83.js', js);
console.log("Fixed slashes.");