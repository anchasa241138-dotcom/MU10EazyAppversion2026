const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('if (isPreview) {');
console.log(js.substring(Math.max(0, s-200), s+2000));