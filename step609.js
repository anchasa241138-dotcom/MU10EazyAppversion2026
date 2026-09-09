const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('radio') && html.includes('pdfSignMode')) {
    console.log('RADIO BUTTONS STILL EXIST!');
    const lines = html.split('\n');
    lines.forEach((l, i) => {
        if(l.includes('pdfSignMode')) console.log(`${i+1}: ${l}`);
    });
} else {
    console.log('No radio buttons');
}
