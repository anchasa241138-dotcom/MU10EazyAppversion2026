const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove the wet/draw options from dropdowns
html = html.replace(/<option value="wet">-- เซ็นด้วยตัวเอง \(Wet Signature\) --<\/option>\s*<option value="draw">-- วาดลายเซ็น \(E-Signature\) --<\/option>/g, '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Cleaned up dropdowns');
