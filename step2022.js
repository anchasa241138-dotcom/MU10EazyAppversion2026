const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const keywords = ['Chart2', 'chart2', 'barChart', 'samplesByType', 'renderChart', 'initChart', 'Chart(', 'new Chart'];
keywords.forEach(kw => {
    const idx = js.indexOf(kw);
    console.log(`"${kw}" => index: ${idx}`);
    if (idx !== -1) {
        console.log(js.substring(Math.max(0, idx - 80), idx + 120));
        console.log('---');
    }
});