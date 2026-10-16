const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('.auth-card {');
console.log(html.substring(Math.max(0, s-100), s + 500));