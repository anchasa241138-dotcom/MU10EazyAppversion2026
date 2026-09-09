const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<table class="modern-table" style="background: white; border-radius: 8px; overflow-y: auto;/, '<table class="modern-table" style="background: white; border-radius: 8px; overflow: hidden;');

html = html.replace(/overflow-y: auto;/, 'overflow: hidden;'); // For auth modal as well

fs.writeFileSync('index.html', html, 'utf8');
console.log('Reverted table and auth modal');
