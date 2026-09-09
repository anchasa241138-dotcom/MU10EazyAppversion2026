const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, i) => {
    if(l.includes('=== \'ผ่าน\'') || l.includes('!== \'ผ่าน\'') || l.includes('=== "ผ่าน"')) {
        console.log(`${i+1}: ${l}`);
    }
});
