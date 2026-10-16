const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = 668989;
// Search backwards from 668989 for function declaration or method declaration
let fnPos = js.lastIndexOf('(', pos);
while (fnPos > 0) {
    let lineStart = js.lastIndexOf('\n', fnPos);
    let line = js.substring(lineStart, fnPos + 10);
    if (line.includes('function') || line.match(/^\s*[a-zA-Z0-9_]+\s*\(/)) {
        console.log('Enclosing method/function:', line.trim());
        break;
    }
    fnPos = js.lastIndexOf('(', fnPos - 1);
}