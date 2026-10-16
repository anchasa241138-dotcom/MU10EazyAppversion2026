const fs = require('fs');
const js = fs.readFileSync('app_v83.js', 'utf8');
console.log('handleRegister index:', js.indexOf('handleRegister(e)'));
console.log('updateSidebarBadges index:', js.indexOf('updateSidebarBadges() {'));