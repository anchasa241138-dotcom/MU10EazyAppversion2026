const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
for(let i=1500; i<1535; i++){
    if(lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
