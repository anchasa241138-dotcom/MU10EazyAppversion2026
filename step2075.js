const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const s = js.indexOf('approvedTbody.innerHTML = approvedUsers');
const e = js.indexOf('deleteUser(username)', s);
console.log(js.substring(s, e));