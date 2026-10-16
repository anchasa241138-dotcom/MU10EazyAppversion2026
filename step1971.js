const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/<td style="width: 1%; white-space: nowrap; font-weight: bold; vertical-align: top; padding-right: 5px;">หมายเหตุ<\/td>/g, 
                '<td style="width: 50px; font-weight: bold; vertical-align: top;">หมายเหตุ</td>');

fs.writeFileSync('app_v83.js', js);
console.log("Fixed note overlapping bug!");