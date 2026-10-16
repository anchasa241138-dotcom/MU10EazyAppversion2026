const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/<img src="data:image\/jpeg;base64,\$\{typeof logoBase64 !== 'undefined' \? logoBase64 : ''\}"/g, '<img src="${typeof logoBase64 !== \'undefined\' ? (logoBase64.startsWith(\'data:\') ? logoBase64 : \'data:image/jpeg;base64,\' + logoBase64) : \'\'}"');

fs.writeFileSync('app_v83.js', js);
console.log('Fixed double data:image/jpeg;base64 prefix');