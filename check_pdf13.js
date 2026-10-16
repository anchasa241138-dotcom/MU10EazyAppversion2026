const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('.print(');
while (pos !== -1) {
    console.log('Found .print( at:', pos);
    console.log(js.substring(pos - 100, pos + 200));
    pos = js.indexOf('.print(', pos + 1);
}