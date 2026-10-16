const fs = require('fs');
let css = fs.readFileSync('style_v3.css', 'utf8');

const regex = /\.form-select-card\[data-form-type="MU\.10-007"\] \.form-icon \{.*?\}/;
const colorRule = `\n.form-select-card[data-form-type="MU.10-008"] .form-icon { background: linear-gradient(135deg, #a855f7, #9333ea); box-shadow: 0 8px 15px rgba(168,85,247,0.25); }`;

css = css.replace(regex, match => match + colorRule);
fs.writeFileSync('style_v3.css', css);
console.log('Updated CSS');