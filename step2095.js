const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
js = js.replace('}\n\n    logout() {', '},\n\n    logout() {');
fs.writeFileSync('app_v83.js', js);