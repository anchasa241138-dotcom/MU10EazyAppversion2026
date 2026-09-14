const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

const match = lines.findIndex(l => l.includes('else if (sample.form_type === \'MU.10-002\') {'));
if (match > -1) {
    for(let i = match; i < match + 200; i++) {
        if(lines[i] && lines[i].includes('container.innerHTML = fullHtml;')) {
            console.log(`Found container assignment at ${i+1}`);
            break;
        }
        if(lines[i] && lines[i].includes('</div>')) {
            // just to see where it closes
        }
    }
}
