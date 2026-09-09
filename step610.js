const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix the name
html = html.replace(/นางสาวฐิติพร โสภณ/g, 'นางสาวฐิติพร อินศร');

// Remove the old global radio buttons
const startMarker = '<div class="form-section-divider" style="margin-top: 20px;"></div>';
const startIdx = html.indexOf(startMarker);
if (startIdx !== -1) {
    const endMarker = '<!-- Actions -->';
    const endIdx = html.indexOf(endMarker, startIdx);
    if (endIdx !== -1) {
        html = html.substring(0, startIdx) + html.substring(endIdx);
    }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed name and removed old radio buttons');
