const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/overflow: hidden;/g, 'overflow-y: auto;');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed overflow in all modals');
