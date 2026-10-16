const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('.auth-container {');
console.log(html.substring(s, s + 500));