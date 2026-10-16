const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
js = js.replace(/updateDashboardStats\(\) \{\r?\n\s*let visible = this\.getVisibleSamples\(\);/, 
"updateDashboardStats() {\n        let visible = this.samples; // Show global stats to everyone");
fs.writeFileSync('app_v83.js', js);