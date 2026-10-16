const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, viewOnly = false, forceEdit = false)');
const e = js.indexOf('enableEditApproval()', s);
const content = js.substring(s, e);
const htmlAss = content.indexOf('container.innerHTML = fullHtml;');
console.log(content.substring(htmlAss - 2000, htmlAss + 100));