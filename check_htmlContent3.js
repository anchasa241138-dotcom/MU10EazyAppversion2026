const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf("let htmlContent = '';");
console.log(js.substring(pos + 5000, pos + 10000));