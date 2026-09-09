const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="signature-options-box"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
html = html.replace(regex, '');

fs.writeFileSync('index.html', html, 'utf8');
