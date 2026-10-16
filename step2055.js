const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// I'll parse it with a basic regex to see if I accidentally deleted something or commented it out.
const regFormIdx = html.indexOf('<form id="registerForm"');
const endRegFormIdx = html.indexOf('</form>', regFormIdx);

const content = html.substring(regFormIdx, endRegFormIdx + 7);
console.log(content.includes('id="reg-confirm-password"'));
console.log(content.includes('ลงทะเบียนสมัครสมาชิก'));