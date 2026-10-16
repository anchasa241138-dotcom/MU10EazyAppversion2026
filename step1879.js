const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("let htmlContent = '';");
console.log(js.substring(s, s+2000).replace(/\s+/g, ' ').substring(0, 1000));