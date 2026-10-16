const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('analysisChart');
if (idx !== -1) {
    console.log(html.substring(idx - 200, idx + 200));
} else {
    console.log("NOT FOUND in index.html");
}