const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('html2pdf');
while (pos !== -1) {
    console.log('Found html2pdf at:', pos);
    console.log(js.substring(pos - 100, pos + 300));
    pos = js.indexOf('html2pdf', pos + 1);
}