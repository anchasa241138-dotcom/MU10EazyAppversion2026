const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// Find the else block inside addGlobalSampleEntry
const match = js.match(/} else \{\s*div\.innerHTML = `[\s\S]{0,100}/g);
console.log(match);