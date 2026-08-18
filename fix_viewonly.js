const fs = require('fs');
let code = fs.readFileSync('app_v49_23.js', 'utf8');

code = code.replace(/if \(isViewOnly\) \{/g, 'if (viewOnly) {');
code = code.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=35');

fs.writeFileSync('app_v49_23.js', code, 'utf8');

let indexCode = fs.readFileSync('index.html', 'utf8');
indexCode = indexCode.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=35');
fs.writeFileSync('index.html', indexCode, 'utf8');

console.log('Fixed ReferenceError for isViewOnly');
