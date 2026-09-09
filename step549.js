const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

js = js.replace(/return \\`/g, "return `");
js = js.replace(/                \\`;/g, "                `;");
js = js.replace(/\\\$\{/g, "${");

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed backticks');
