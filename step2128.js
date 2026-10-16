const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app_v83\.js\?v=\d+/, "app_v83.js?v=" + Date.now());
html = html.replace(/charts-dash\.js\?v=\d+/, "charts-dash.js?v=" + Date.now());
fs.writeFileSync('index.html', html);