const fs = require('fs');
let content = fs.readFileSync('app_v49_23.js', 'utf8');

const regex = /('thitiporn':\s*\{[^}]*sig:\s*)([^]+|'[^']+')(\s*\})/;
content = content.replace(regex, (match, p1, p2, p3) => {
    return p1 + '\$base64String\' + p3;
});

fs.writeFileSync('app_v49_23.js', content, 'utf8');
console.log('Replaced Thitiporn signature');
