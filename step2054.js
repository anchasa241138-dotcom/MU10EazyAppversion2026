const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('<div class="password-meter mt-2">');
const e = html.indexOf('</form>', s);
console.log(html.substring(s, e));