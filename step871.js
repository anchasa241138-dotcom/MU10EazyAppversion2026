const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for(let i=2750; i<2800; i++) {
    if(lines[i] && lines[i].includes('container = document.getElementById')) {
        console.log(`Found container at line ${i+1}: ${lines[i].trim()}`);
    }
}
