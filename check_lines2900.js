const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
let lines = js.split('\n');
for (let i = 2900; i < 2940; i++) {
    console.log((i+1) + ': ' + lines[i]);
}