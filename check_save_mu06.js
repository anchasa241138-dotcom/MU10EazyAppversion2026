const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('handleSaveAnalysis(e) {');
let end = js.indexOf('closeAnalysisInputModal() {', pos);
let p = js.indexOf('MU.10-006', pos);
if (p !== -1 && p < end) {
    console.log('Found MU.10-006 in handleSaveAnalysis at:', p - pos);
} else {
    console.log('MU.10-006 is NOT in handleSaveAnalysis (which means it will use summaryEl properly)!');
}