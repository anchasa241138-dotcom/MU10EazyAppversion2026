const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('<div id="authScreen"');
console.log(html.substring(s, s + 1000));