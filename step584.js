const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

js = js.replace(/ \|\|  === 'ผ่านเกณฑ์มาตรฐาน'/g, "");

fs.writeFileSync('app_v49_23.js', js, 'utf8');
