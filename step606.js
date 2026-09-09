const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

// Remove the inline drawing logic from openCertifyModal
const newOpenModalLogic = `
                // If there are existing drawn signatures, draw them onto the canvas!
                // We let initSignaturePad handle loading the saved data to avoid race conditions!
`;
js = js.replace(/                \/\/ If there are existing drawn signatures, draw them onto the canvas![\s\S]*?\n                \}\);\n/, newOpenModalLogic);

// Add the loading logic inside initSignaturePad
const newInitPadLogic = `
        // Initialize or re-enable
        if (typeof SignaturePad !== 'undefined') {
            if (!this.signaturePads[roleId]) {
                this.signaturePads[roleId] = new SignaturePad(canvas, {
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    penColor: 'rgb(0, 0, 128)' // Dark blue pen
                });
            }
            
            // Load existing signature if we have one for this sample
            const refId = document.getElementById('btnApproveAndSign')?.dataset?.refId;
            if (refId) {
                const sample = this.samples.find(s => s.ref_id === refId);
                const dbKey = roleId.replace('-', '_');
                if (sample && sample['sig_' + dbKey]) {
                    // Use setTimeout to ensure SignaturePad is fully ready
                    setTimeout(() => {
                        this.signaturePads[roleId].fromDataURL(sample['sig_' + dbKey], { ratio: Math.max(window.devicePixelRatio || 1, 1) });
                    }, 10);
                } else {
                    this.signaturePads[roleId].clear();
                }
            }
        }
    },
`;

js = js.replace(/        \/\/ Initialize or re-enable[\s\S]*?\}\s*\}\s*\},/, newInitPadLogic);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed signature loading logic');
