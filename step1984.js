const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('MU.10-005');
console.log(js.match(/<style>\.pdf-document \* \{/g));