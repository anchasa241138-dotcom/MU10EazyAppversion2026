const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('(เฉพาะ MU.10-001)', '');
fs.writeFileSync('index.html', html);
console.log("Updated HTML label");