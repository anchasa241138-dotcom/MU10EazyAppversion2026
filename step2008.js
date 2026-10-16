const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const matches = [...js.matchAll(/MU\.10-005/g)];
matches.forEach(m => console.log("Index:", m.index, "Context:", js.substring(m.index - 50, m.index + 50)));