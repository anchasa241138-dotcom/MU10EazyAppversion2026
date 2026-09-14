const fs = require('fs');

fs.renameSync('app_v53.js', 'app_v54.js');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app_v53\.js/g, 'app_v54.js');
fs.writeFileSync('index.html', html, 'utf8');

console.log("Renamed to app_v54.js");
