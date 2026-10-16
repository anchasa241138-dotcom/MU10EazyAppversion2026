const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');
js = js.replace(/const visibleSamples = typeof app !== 'undefined' \? app\.getVisibleSamples\(\) : window\.mockSamples;/g, 
"// Use ALL samples for the global dashboard, regardless of role\nconst visibleSamples = typeof app !== 'undefined' ? app.samples : window.mockSamples;");
fs.writeFileSync('charts-dash.js', js);