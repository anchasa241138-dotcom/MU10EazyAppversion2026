const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s1 = js.indexOf("if (sample.form_type === 'MU.10-001') {");
const e1 = js.indexOf("} else if (sample.form_type === 'MU.10-002') {", s1);
const content = js.substring(s1, e1);
console.log(content.match(/background[^>]+/g));