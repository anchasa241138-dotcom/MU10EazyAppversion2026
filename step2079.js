const { execSync } = require('child_process');
const js = execSync('git show HEAD~2:app_v83.js').toString('utf8');
let s = js.indexOf('handleRegister(e)');
let e = js.indexOf('updateSidebarBadges() {', s);
console.log(js.substring(s, s + 500));
console.log('... AND AT THE END ...');
console.log(js.substring(e - 500, e));