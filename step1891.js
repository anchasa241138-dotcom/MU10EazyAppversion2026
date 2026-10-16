const fs = require('fs');
let content = fs.readFileSync('test_pdf.js', 'utf8');
content = content.replace("const document = {", "const document = { addEventListener: () => {},");
fs.writeFileSync('test_pdf.js', content);