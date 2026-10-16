const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let pos = html.indexOf('id="analysisInputModal"');
console.log(html.substring(pos, pos + 3000));