const fs = require('fs');
let css = fs.readFileSync('style_v3.css', 'utf8');
const s = css.indexOf('.auth-card {');
console.log(css.substring(Math.max(0, s-100), s + 1000));