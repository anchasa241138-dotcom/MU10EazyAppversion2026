const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/<td style="width:50%; text-align:right; padding:4px 0;">สถานที่เก็บตัวอย่าง/g, '<td style="width:50%; padding:4px 0; text-align:left;">สถานที่เก็บตัวอย่าง');
js = js.replace(/<td style="width:50%; text-align:right; padding:4px 0;">วันที่เก็บตัวอย่าง/g, '<td style="width:50%; padding:4px 0; text-align:left;">วันที่เก็บตัวอย่าง');

fs.writeFileSync('app_v83.js', js);
console.log('Fixed alignment');