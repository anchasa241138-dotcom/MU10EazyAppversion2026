const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/updateDashboardCharts\(this\.samples\)/g, "updateDashboardCharts(this.getVisibleSamples())");

fs.writeFileSync('app_v83.js', js);
console.log('Fixed charts inconsistency');