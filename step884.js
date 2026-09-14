const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for(let i=3350; i<3450; i++) {
    if(lines[i] && lines[i].includes('PDF')) {
        console.log(`Found PDF at line ${i+1}: ${lines[i]}`);
    }
}
