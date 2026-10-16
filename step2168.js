const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const regexFooter = /<td style="width:33%; vertical-align:top; text-align:center; padding-right:10px;">\s*<div>ลงชื่อผู้เก็บตัวอย่าง/g;
js = js.replace(regexFooter, '<td style="width:33%; vertical-align:top; text-align:left; padding-right:10px;">\n                                    <div>ลงชื่อผู้เก็บตัวอย่าง');

fs.writeFileSync('app_v83.js', js);
console.log('Fixed left alignment for signatures');