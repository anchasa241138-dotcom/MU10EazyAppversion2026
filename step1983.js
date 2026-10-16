const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
console.log("Context 1:", js.substring(1122055 - 100, 1122055 + 50));
console.log("Context 2:", js.substring(1143126 - 100, 1143126 + 50));