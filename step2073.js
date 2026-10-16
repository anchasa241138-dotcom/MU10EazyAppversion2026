const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/this\.samples = data;/g, `this.samples = Array.isArray(data) ? data : Object.values(data);`);

fs.writeFileSync('app_v83.js', js);
console.log("Fixed this.samples to be an array");