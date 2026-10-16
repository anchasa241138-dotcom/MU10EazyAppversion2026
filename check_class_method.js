const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = 668989;
let lines = js.substring(0, pos).split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
    let l = lines[i];
    if (l.match(/^\s{4}[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{/)) {
        console.log('Class method is:', l.trim(), 'at line', (i+1));
        break;
    }
}