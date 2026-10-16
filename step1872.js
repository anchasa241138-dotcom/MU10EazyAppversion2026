const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const matches = [...js.matchAll(/MU\.10-005/g)];
for (let i = 0; i < matches.length; i++) {
    console.log(`\n\nMATCH ${i}:`);
    console.log(js.substring(matches[i].index - 30, matches[i].index + 200));
}