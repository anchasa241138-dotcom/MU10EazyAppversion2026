const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
let newRegister = fs.readFileSync('new_register.txt', 'utf8');

js = js.replace(/handleRegister\(e\) \{[\s\S]*?logout\(\)\s*\{/, newRegister + '\n\n    logout() {');

fs.writeFileSync('app_v83.js', js);
console.log('Successfully replaced handleRegister');