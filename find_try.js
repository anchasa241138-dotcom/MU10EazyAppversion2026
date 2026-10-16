const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');
let lines = js.split('\n');
for (let i = 4998; i >= 0; i--) {
    if (lines[i].includes('try {') || lines[i].includes('try{')) {
        console.log('Found try at line:', (i+1), lines[i]);
        break;
    }
}