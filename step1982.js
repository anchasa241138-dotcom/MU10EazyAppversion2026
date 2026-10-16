const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

console.log("Occurrences of global style:");
const matches = [...js.matchAll(/<style>\* \{/g)];
matches.forEach(m => {
    console.log("Index:", m.index);
    // Find what function it's in
    const before = js.substring(0, m.index);
    const lastFunc = before.lastIndexOf('function');
    console.log(js.substring(lastFunc, lastFunc + 50));
});