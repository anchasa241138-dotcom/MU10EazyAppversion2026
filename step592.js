const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const replacement = `
            // Attach refId to approve button
            btnApprove.dataset.refId = refId;
            
            // Sync UI state for modes
            if (this.toggleSignMode) {
                this.toggleSignMode('analyst-1');
                this.toggleSignMode('analyst-2');
                this.toggleSignMode('approver-1');
                
                // If there are existing drawn signatures, draw them onto the canvas!
                ['analyst-1', 'analyst-2', 'approver-1'].forEach(roleId => {
                    const dbKey = roleId.replace('-', '_');
                    const canvas = document.getElementById('canvas-' + roleId);
                    const mode = document.getElementById('mode-' + roleId)?.value;
                    if (mode === 'draw' && sample['sig_' + dbKey] && canvas) {
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        img.onload = () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            // Also load it into SignaturePad data if needed
                            if(this.signaturePads && this.signaturePads[roleId]) {
                                this.signaturePads[roleId].fromDataURL(sample['sig_' + dbKey]);
                            }
                        };
                        img.src = sample['sig_' + dbKey];
                    }
                });
            }
`;

js = js.replace(/            \/\/ Attach refId to approve button\s*btnApprove\.dataset\.refId = refId;/, replacement);

// I should remove the old toggleSignMode call that was higher up in openCertifyModal
js = js.replace(/                if \(this\.toggleSignMode\) this\.toggleSignMode\(\);\s*/, "");

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed toggle states');
