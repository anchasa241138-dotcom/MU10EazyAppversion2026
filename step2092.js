const fs = require('fs');
const js = fs.readFileSync('app_v83.js', 'utf8');
const idx = js.indexOf('handleRegister(e)');
const nextFuncRegex = /\n    [a-zA-Z0-9_]+\(.*?\)\s*\{/g;
nextFuncRegex.lastIndex = idx + 1;
const match = nextFuncRegex.exec(js);
console.log('Next function:', match ? match[0] : 'Not found');