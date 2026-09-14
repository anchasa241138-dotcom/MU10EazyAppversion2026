const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

for(let i=700; i<730; i++) {
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
