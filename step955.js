const fs = require('fs');
let js = fs.readFileSync('app_v52.js', 'utf8');
const lines = js.split('\n');
const match = lines.findIndex(l => l.includes('else if (sample.form_type === \'MU.10-003\') {'));
if (match > -1) {
    let endMatch = -1;
    for (let i = match; i < match + 200; i++) {
        if(lines[i] && lines[i].includes('if(viewOnly || (sample.status === \'approved\' && !forceEdit)) {')) {
            endMatch = i;
            break;
        }
    }
    if (endMatch > -1) {
        let block = '';
        for (let i = match; i < endMatch; i++) {
            block += lines[i] + '\n';
        }
        fs.writeFileSync('mu10003_block.txt', block, 'utf8');
        console.log(`Saved block to mu10003_block.txt`);
    }
}
