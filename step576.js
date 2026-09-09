const fs = require('fs');
let css = fs.readFileSync('style_v2.css', 'utf8');
const lines = css.split('\n');
console.log('--- 297 ---');
for(let i = 290; i < 305; i++) if(lines[i]) console.log(lines[i]);
console.log('--- 473 ---');
for(let i = 465; i < 480; i++) if(lines[i]) console.log(lines[i]);
console.log('--- 830 ---');
for(let i = 820; i < 840; i++) if(lines[i]) console.log(lines[i]);
