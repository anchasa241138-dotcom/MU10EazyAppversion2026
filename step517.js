const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const correctLogic = `
                const s1 = document.getElementById('sel-analyst-1');
                const s2 = document.getElementById('sel-analyst-2');
                const s3 = document.getElementById('sel-approver-1');
                const s4 = document.getElementById('sel-approver-2');
                
                s1.onchange = () => this.checkSignaturePadVisibility();
                s2.onchange = () => this.checkSignaturePadVisibility();
                s3.onchange = () => this.checkSignaturePadVisibility();
                s4.onchange = () => this.checkSignaturePadVisibility();
                
                // Reset pad when opening
                if (this.clearSignaturePad) this.clearSignaturePad();
                if (this.checkSignaturePadVisibility) this.checkSignaturePadVisibility();
                
                const btnApprove = document.getElementById('btnApproveAndSign');
`;

// I need to replace from 3017 to 3033
js = js.replace(/const s1 = document\.getElementById\('sel-analyst-1'\);[\s\S]*?const btnApprove = document\.getElementById\('btnApproveAndSign'\);/, correctLogic);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed syntax error');
