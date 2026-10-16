const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, viewOnly = false, forceEdit = false)');
const e = js.indexOf('}', s+6000); // just somewhere further
const content = js.substring(s, s+8000);
const s_mu = content.indexOf('MU.10-004');
console.log(content.substring(s_mu-200, s_mu+800));