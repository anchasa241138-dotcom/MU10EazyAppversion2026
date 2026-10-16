const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let end = js.indexOf('handleSaveAnalysis(e) {', pos);
console.log('Length of renderAnalysisDynamicSection:', end - pos);

// Search for each form_type in this function
['MU.10-001', 'MU.10-002', 'MU.10-003', 'MU.10-004', 'MU.10-005', 'MU.10-006', 'MU.10-007', 'MU.10-008'].forEach(ft => {
    let p = js.indexOf(`form_type === '${ft}'`, pos);
    if (p !== -1 && p < end) {
        console.log(`Has ${ft} at offset:`, p - pos);
    } else {
        console.log(`MISSING ${ft}!`);
    }
});