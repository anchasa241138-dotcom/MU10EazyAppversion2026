const fs = require('fs');
let content = fs.readFileSync('test_pdf.js', 'utf8');
content = content.replace("innerText: ''", "innerText: '', children: []");
fs.writeFileSync('test_pdf.js', content);