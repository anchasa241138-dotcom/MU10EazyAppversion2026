const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

js = js.replace(/ticks: \{ font: \{ family: 'Sarabun', size: 11 \}, maxRotation: 0, minRotation: 0 \}/, "ticks: { font: { family: 'Sarabun', size: 11 }, autoSkip: false, maxRotation: 45, minRotation: 0 }");

fs.writeFileSync('charts-dash.js', js);
console.log('Fixed rotation and autoSkip');