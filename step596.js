const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

js = js.replace(/        if \(mode === 'draw'\) \{\n            container\.style\.display = 'block';\n            this\.initSignaturePad\(roleId\);\n        \}/, `        if (mode === 'draw') {
            container.style.display = 'block';
            setTimeout(() => this.initSignaturePad(roleId), 50);
        }`);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Added setTimeout');
