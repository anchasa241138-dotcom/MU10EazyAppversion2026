const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("if (sample.form_type === 'MU.10-004') {", js.indexOf('openCertifyModal'));
console.log(js.substring(s, s+600));