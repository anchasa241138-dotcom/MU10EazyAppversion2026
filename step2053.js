const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('<div class="password-meter mt-2">');
console.log(html.substring(s, s + 1000));