const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(/if \(sampleData\.form_type === 'MU\.10-003'\) \{/g, 'if (sampleData.form_type === \'MU.10-003\' || sampleData.form_type === \'MU.10-008\') {');

fs.writeFileSync('app_v83.js', js);
console.log('Updated skip logic for MU.10-008');