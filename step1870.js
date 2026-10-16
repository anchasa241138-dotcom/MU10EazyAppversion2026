const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const matches = [...js.matchAll(/MU\.10-005/g)];
const pdfGenMatch = matches[4]; 
console.log(js.substring(pdfGenMatch.index, pdfGenMatch.index + 1000));