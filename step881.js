const fs = require('fs');
let js = fs.readFileSync('app_v50.js', 'utf8');
const lines = js.split('\n');

for(let i=3430; i<3470; i++) {
    if(lines[i] && lines[i].includes('html2pdf')) {
        console.log(`Found html2pdf at line ${i+1}`);
        for(let j=i-10; j<i+5; j++) {
            if(lines[j]) console.log(`${j+1}: ${lines[j]}`);
        }
    }
}
