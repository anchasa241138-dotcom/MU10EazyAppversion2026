const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<div class="form-selection-grid" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 25px; padding: 20px 10px;">/, '<div class="form-selection-grid">');

fs.writeFileSync('index.html', html);
console.log('Updated index.html');