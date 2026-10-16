const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update #authModal .modal-card
html = html.replace('#authModal .modal-card {', '#authModal .modal-card {\n            display: flex;\n            flex-direction: column;');

// Update #authModal .modal-body
html = html.replace('#authModal .modal-body {', '#authModal .modal-body {\n            flex: 1;\n            min-height: 0;\n            overflow-y: auto;\n            max-height: none !important;');

// Bump version
html = html.replace(/charts-dash\.js\?v=\d+/, `charts-dash.js?v=${Date.now()}`);

fs.writeFileSync('index.html', html);
console.log("Fixed flex layout for authModal");