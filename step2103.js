const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');
js = js.replace(/\/\/ Use ALL samples for the global dashboard, regardless of role\r?\nconst visibleSamples = typeof app !== 'undefined' \? app\.samples : window\.mockSamples;/g, 
"const visibleSamples = typeof app !== 'undefined' ? app.getVisibleSamples() : window.mockSamples;");
fs.writeFileSync('charts-dash.js', js);
console.log('Reverted charts-dash.js');