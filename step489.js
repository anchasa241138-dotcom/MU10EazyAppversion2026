const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const match = lines.findIndex(l => l.includes('ผู้ตรวจวิเคราะห์คนที่ 1'));
if (match > -1) {
    for(let i = match - 5; i < match + 20; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
