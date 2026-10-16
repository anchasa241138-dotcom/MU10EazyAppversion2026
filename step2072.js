const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/this\.users = data;/g, `this.users = Object.values(data);`);

fs.writeFileSync('app_v83.js', js);
console.log("Fixed this.users to be an array");