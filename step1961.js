const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/background: white; color: black;/g, 'background-color: white; color: black; background-size: 100% 100% !important; background-repeat: no-repeat !important;');

fs.writeFileSync('app_v83.js', js);
console.log("Fixed background shorthand bug!");