const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for(let i=2830; i<2850; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
