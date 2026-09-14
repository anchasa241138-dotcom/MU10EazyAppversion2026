const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for(let i=1500; i<1850; i++) {
    if(lines[i] && lines[i].includes('save')) {
        console.log(`Found at line ${i+1}: ${lines[i]}`);
    }
}
