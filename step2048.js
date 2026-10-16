const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('user-pass-section');
const e = html.indexOf('</form>', s);
console.log(html.substring(s - 50, e));