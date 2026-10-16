const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = 668989;
console.log(js.substring(pos, pos + 4000));