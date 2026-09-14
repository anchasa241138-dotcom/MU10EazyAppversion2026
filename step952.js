const fs = require('fs');
fs.renameSync('app_v51.js', 'app_v52.js');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app_v51\.js/g, 'app_v52.js');
fs.writeFileSync('index.html', html, 'utf8');

console.log("Renamed to app_v52.js");
