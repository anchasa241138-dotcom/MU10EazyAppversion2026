const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('    </div>div>\n    </div>', '    </div>\n');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Fixed syntax error");
