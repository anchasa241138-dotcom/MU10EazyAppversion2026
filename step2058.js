const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add some padding-bottom to the form to ensure it's not clipped
html = html.replace('<form id="registerForm" class="auth-subform">', '<form id="registerForm" class="auth-subform" style="padding-bottom: 30px;">');

// 2. Add some min-height to reg-auth-block just in case
html = html.replace('.reg-auth-block {', '.reg-auth-block { min-height: 300px; padding-bottom: 30px;');

// 3. Make sure the grid expands
html = html.replace('grid-template-columns: 3fr 2fr;', 'grid-template-columns: 3fr 2fr; align-items: start;');

// Bump version
html = html.replace(/charts-dash\.js\?v=\d+/, `charts-dash.js?v=${Date.now()}`);

fs.writeFileSync('index.html', html);
console.log("Updated HTML");