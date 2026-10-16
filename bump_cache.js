const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/app_v84\.js\?v=\d+/, `app_v84.js?v=${Date.now()}`);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Bumped index.html cache-buster timestamp');