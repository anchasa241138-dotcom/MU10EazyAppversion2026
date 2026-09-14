const fs = require('fs');
let js = fs.readFileSync('app_v52.js', 'utf8');
const lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('oil_type') || lines[i].includes('fry_duration') || lines[i].includes('replacement_freq')) {
        console.log(`${i+1}: ${lines[i]}`);
    }
}
