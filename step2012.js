const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("if (sample.form_type === 'MU.10-004') {", js.indexOf('openCertifyModal'));
const e = js.indexOf("container.innerHTML =", s);
console.log(js.substring(e, e+500));