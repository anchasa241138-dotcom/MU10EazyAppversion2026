const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

js = js.replace(/col\.style\.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba\\(0,0,0,0\\.05\\); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;';/, 
"col.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-width: 0; box-sizing: border-box; overflow: hidden;';");

fs.writeFileSync('charts-dash.js', js);