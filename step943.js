const fs = require('fs');

// Rename app_v50.js to app_v51.js
fs.renameSync('app_v50.js', 'app_v51.js');

// Update index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app_v50\.js/g, 'app_v51.js');
fs.writeFileSync('index.html', html, 'utf8');

console.log("Renamed to app_v51.js and updated index.html");
