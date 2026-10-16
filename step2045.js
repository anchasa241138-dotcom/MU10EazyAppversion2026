const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('<form id="registerForm"');
console.log(html.substring(Math.max(0, s - 1000), s + 100));