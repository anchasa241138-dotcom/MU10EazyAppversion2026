const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

js = js.replace(/=== 'ผ่าน' \|\|  === 'ผ่านเกณฑ์มาตรฐาน'/g, "=== 'ผ่าน'");
js = js.replace(/!== 'ผ่าน' \|\|  === 'ผ่านเกณฑ์มาตรฐาน'/g, "!== 'ผ่าน'");

fs.writeFileSync('app_v49_23.js', js, 'utf8');
