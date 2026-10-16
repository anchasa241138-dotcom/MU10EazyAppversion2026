const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const match = js.match(/\} else \{\s*div\.innerHTML = `[\s\S]{0,150}/g);
console.log(match);