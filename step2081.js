const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/    \}\r?\n        this\.updateSidebarBadges\(\);\r?\n    \},/, `    },`);

fs.writeFileSync('app_v83.js', js);
console.log("Fixed SyntaxError properly");