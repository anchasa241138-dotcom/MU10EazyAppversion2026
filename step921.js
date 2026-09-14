const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

const match = lines.findIndex(l => l.includes('else if (sample.form_type === \'MU.10-003\') {'));
if (match > -1) {
    for(let i = match - 20; i < match + 10; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
    }
}
