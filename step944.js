const fs = require('fs');
let js = fs.readFileSync('app_v51.js', 'utf8');
const lines = js.split('\n');

const match = lines.findIndex(l => l.includes('renderDownloadTable(') || l.includes('renderDownloadTable ('));
if (match > -1) {
    for (let i = match; i < match + 60; i++) {
        if(lines[i] && lines[i].includes('ดาวน์โหลดรายงาน PDF')) {
            console.log(`Found button at line ${i+1}: ${lines[i]}`);
            // Let's print the few lines around it to see the onclick handler
            for (let j = i - 2; j <= i + 2; j++) {
                if(lines[j]) console.log(`${j+1}: ${lines[j]}`);
            }
        }
    }
} else {
    console.log("renderDownloadTable not found");
}
