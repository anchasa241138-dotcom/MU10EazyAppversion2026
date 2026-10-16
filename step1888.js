const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace('width: 1000px !important; min-height: 990px; display: block', 'width: 780px !important; min-height: 1100px; display: block');

fs.writeFileSync('app_v83.js', js);
console.log("Adjusted width to 780px");