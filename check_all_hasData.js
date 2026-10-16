const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('${hasData ? (i + 1) : \'\'}');
while (pos !== -1) {
    console.log('Found hasData at:', pos);
    pos = js.indexOf('${hasData ? (i + 1) : \'\'}', pos + 1);
}