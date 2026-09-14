const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

for(let i=1250; i<1300; i++) {
    if(lines[i] && lines[i].includes('บันทึกการรับตัวอย่างตรวจวิเคราะห์')) {
        console.log(`Found Verify Accept Modal at line ${i+1}`);
        for(let j=i-5; j<i+10; j++) {
            if(lines[j]) console.log(`${j+1}: ${lines[j]}`);
        }
    }
}
