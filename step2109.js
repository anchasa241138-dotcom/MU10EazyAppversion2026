const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const newVisible = fs.readFileSync('new_visible2.txt', 'utf8');

js = js.replace(/getVisibleSamples\(\) \{[\s\S]*?return this\.samples\.filter\(s => s\.created_by === this\.currentUser\.username\);\r?\n    \}/, newVisible);

fs.writeFileSync('app_v83.js', js);
console.log('Replaced SSJ logic');