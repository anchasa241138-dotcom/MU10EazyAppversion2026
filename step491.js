const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
    if(l.includes('saveCertify()') || l.includes('app.saveCertify')) {
        console.log(`${i+1}: ${l}`);
    }
});
