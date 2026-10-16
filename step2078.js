const fs = require('fs');
let js = fs.readFileSync('temp.js', 'utf8');
let s = js.indexOf('handleRegister(e)');
let e = js.indexOf('updateSidebarBadges() {', s);
console.log(js.substring(s, e));