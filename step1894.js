const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, isViewOnly = false)');
console.log(js.substring(s, s+800));