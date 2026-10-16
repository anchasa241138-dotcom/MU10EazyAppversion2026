const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const keywords = ['updateDashboard', 'renderDashboard', 'loadDashboard', 'dashboard', 'แดชบอร์ด'];
keywords.forEach(kw => {
    const matches = [...js.matchAll(new RegExp(kw, 'g'))];
    console.log(`"${kw}" => ${matches.length} matches`);
    if (matches.length > 0) {
        matches.slice(0, 3).forEach(m => {
            console.log(`  Index ${m.index}: ${js.substring(Math.max(0, m.index - 30), m.index + 80)}`);
        });
    }
    console.log('---');
});