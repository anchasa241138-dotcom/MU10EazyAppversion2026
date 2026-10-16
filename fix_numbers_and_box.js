const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

// 1. Fix sequential numbers for MU.10-006
js = js.replace('${hasData ? (i + 1) : \'\'}', '${i + 1}');

// 2. Remove the square box in the bottom right
const squareHtml = '<div style="margin-top:12px; width:18px; height:18px; border:1px solid #000;"></div>';
js = js.replace(squareHtml, '');

fs.writeFileSync('app_v84.js', js, 'utf8');
console.log('Successfully updated app_v84.js with number fix and removed square box!');