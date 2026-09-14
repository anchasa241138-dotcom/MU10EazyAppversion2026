const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Use a simple regex to see if verifyAcceptModal is inside cert-dynamic-content
const cdcIndex = html.indexOf('id="cert-dynamic-content"');
const vamIndex = html.indexOf('id="verifyAcceptModal"');
console.log(`cert-dynamic-content index: ${cdcIndex}`);
console.log(`verifyAcceptModal index: ${vamIndex}`);
