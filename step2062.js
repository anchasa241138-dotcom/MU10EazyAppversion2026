const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('<div class="reg-note-block">');
const e = html.indexOf('</form>', s);
console.log(html.substring(s, e + 10));