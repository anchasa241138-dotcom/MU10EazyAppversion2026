const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const match = lines.findIndex(l => l.includes('id="certApprovalModal"'));
if (match > -1) {
    for(let i = match - 5; i < match + 10; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
