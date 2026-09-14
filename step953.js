const fs = require('fs');
let js = fs.readFileSync('app_v52.js', 'utf8');
const lines = js.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('MU.10-003') && lines[i].includes('polar_value')) {
        // Let's find where MU.10-003 is processed in generateSubmissionPDF to see the field names
    }
}

// Let's just grep for field names in the sampleItems array in generateSubmissionPDF
const match = lines.findIndex(l => l.includes('sampleItems.push({') && lines[l-1] && lines[l-1].includes('MU.10-003'));
if (match > -1) {
    for (let i = match - 2; i < match + 15; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
