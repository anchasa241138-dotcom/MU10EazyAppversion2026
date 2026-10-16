const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/<style>\* \{ font-family:/g, '<style>.pdf-document * { font-family:');

fs.writeFileSync('app_v83.js', js);
console.log("Fixed global style leak!");