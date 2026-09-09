const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="logo-container">[\s\S]*?<\/div>/;
const replacement = `<div class="logo-container" style="justify-content: center; width: 100%;">
                    <img src="logo_mobi_smartlab.png" alt="Mobi SmartLab 10 Logo" style="max-width: 100%; max-height: 70px; object-fit: contain;">
                </div>`;

html = html.replace(regex, replacement);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Replaced logo container');
