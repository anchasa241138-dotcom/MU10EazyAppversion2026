const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('<form id="registerForm"');
const e = html.indexOf('</form>', s);
console.log(html.substring(s, e + 100));