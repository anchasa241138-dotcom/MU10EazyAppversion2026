const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('function updateDashboardCharts');
if (idx !== -1) {
    console.log(html.substring(idx, idx + 1000));
} else {
    const idx2 = html.indexOf('updateDashboardCharts =');
    if (idx2 !== -1) {
        console.log(html.substring(idx2 - 100, idx2 + 1000));
    } else {
        console.log("Not found in index.html");
    }
}