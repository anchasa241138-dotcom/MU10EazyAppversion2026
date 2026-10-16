const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const matches = [...js.matchAll(/min-height:\s*([0-9]+px)/g)];
console.log(matches.map(m => m[0]));