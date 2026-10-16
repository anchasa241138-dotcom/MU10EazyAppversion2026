const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/grid-template-columns: repeat\\(2, 1fr\\); gap: 20px; width: 100%;/g, 
"grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; width: 100%; box-sizing: border-box;");

fs.writeFileSync('index.html', html);