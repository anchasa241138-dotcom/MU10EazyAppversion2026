const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');
let lines = js.split('\n');
for (let i = 4980; i < 5020; i++) {
    console.log((i+1) + ': ' + lines[i]);
}