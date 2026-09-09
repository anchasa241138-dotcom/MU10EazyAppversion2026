const fs = require('fs');

let js = fs.readFileSync('app_v49_23.js', 'utf8');
js = js.replace(/ไม่ผ่านเกณฑ์มาตรฐาน/g, 'ไม่ผ่าน');
js = js.replace(/ผ่านเกณฑ์มาตรฐาน/g, 'ผ่าน');
fs.writeFileSync('app_v49_23.js', js, 'utf8');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/ไม่ผ่านเกณฑ์มาตรฐาน/g, 'ไม่ผ่าน');
html = html.replace(/ผ่านเกณฑ์มาตรฐาน/g, 'ผ่าน');
fs.writeFileSync('index.html', html, 'utf8');

console.log('Replaced all');
