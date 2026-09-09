const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const match = lines.findIndex(l => l.includes('app.toggleSignMode('));
if (match > -1) {
    console.log(`${match+1}: ${lines[match]}`);
}
