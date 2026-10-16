const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('iframe.contentWindow.print()');
console.log(js.substring(pos - 3500, pos + 500));