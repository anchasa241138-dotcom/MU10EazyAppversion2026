const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

const match = lines.findIndex(l => l.includes('html2pdf().set(opt).from(container).save()'));
if (match > -1) {
    for(let i = match - 20; i < match + 10; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
