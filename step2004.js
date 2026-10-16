const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const matches = [...js.matchAll(/htmlContent/g)];
const lastMatchIndex = matches[matches.length - 1].index;
console.log(js.substring(lastMatchIndex - 500, lastMatchIndex + 1500));