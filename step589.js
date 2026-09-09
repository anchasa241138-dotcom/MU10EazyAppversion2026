const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

// Update function definition
js = js.replace(/const renderSignatureSlot = \(personKey, defaultRole\) => \{/, "const renderSignatureSlot = (personKey, defaultRole, roleId) => {");

// Update calls
js = js.replace(/\$\{renderSignatureSlot\(sample\.sel_analyst_1, 'ผู้ตรวจวิเคราะห์'\)\}/g, "${renderSignatureSlot(sample.sel_analyst_1, 'ผู้ตรวจวิเคราะห์', 'analyst_1')}");
js = js.replace(/\$\{renderSignatureSlot\(sample\.sel_analyst_2, 'ผู้ตรวจวิเคราะห์'\)\}/g, "${renderSignatureSlot(sample.sel_analyst_2, 'ผู้ตรวจวิเคราะห์', 'analyst_2')}");
js = js.replace(/\$\{renderSignatureSlot\(sample\.sel_approver_1, 'ผู้รับรอง'\)\}/g, "${renderSignatureSlot(sample.sel_approver_1, 'ผู้รับรอง', 'approver_1')}");
js = js.replace(/\$\{renderSignatureSlot\(sample\.sel_approver_2, 'ผู้รับรอง'\)\}/g, "${renderSignatureSlot(sample.sel_approver_2, 'ผู้รับรอง', 'approver_2')}");

// Update logic inside the function
const newLogic = `
            const isMallika = (personKey === 'mallika');
            const mode = sample['mode_' + roleId] || 'system';
            const drawnSig = sample['sig_' + roleId];
            
            if (mode === 'wet' && personKey && !isMallika) {`;
js = js.replace(/            const isMallika = \(personKey === 'mallika'\);[\s\S]*?if \(sample\.pdfSignMode === 'wet' && personKey && !isMallika\) \{/, newLogic);

const newImgLogic = `
            let imgSrc = p.sig;
            if (mode === 'draw' && drawnSig && !isMallika) {
                imgSrc = drawnSig;`;
js = js.replace(/            let imgSrc = p\.sig;\s*if \(sample\.pdfSignMode === 'draw' && sample\.custom_drawn_sig && !isMallika\) \{\s*imgSrc = sample\.custom_drawn_sig;/, newImgLogic);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Updated renderSignatureSlot calls and logic');
