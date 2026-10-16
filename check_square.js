const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('width:18px; height:18px;');
console.log('Pos of square:', pos);
if (pos !== -1) {
    console.log(js.substring(pos - 100, pos + 100));
}