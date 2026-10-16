const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// For MU.10-005 specifically
js = js.replace(/width: 780px !important; min-height: 1100px;/g, 'width: 780px !important; height: 1103px !important; max-height: 1103px !important;');

fs.writeFileSync('app_v83.js', js);
console.log("Fixed height!");