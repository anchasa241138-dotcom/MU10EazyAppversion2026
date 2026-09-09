const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const replacement = `
    toggleSignMode() {
        const mode = document.querySelector('input[name="pdfSignMode"]:checked');
        if (mode && mode.value === 'draw') {
            document.getElementById('drawSignatureContainer').style.display = 'block';
            if(!this.sigPadInitialized) {
                this.initSignaturePad();
                this.sigPadInitialized = true;
            }
        } else {
            document.getElementById('drawSignatureContainer').style.display = 'none';
        }
    },
    clearForm() {`;

js = js.replace(/clearForm\(\) \{/, replacement);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Added toggleSignMode');
