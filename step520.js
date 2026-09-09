const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

// Replace checkSignaturePadVisibility with toggleSignMode
js = js.replace(/checkSignaturePadVisibility\(\) \{[\s\S]*?\},/g, 
`toggleSignMode() {
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
    },`);

// In openCertifyModal, fix the initialization
js = js.replace(/s1\.onchange = \(\) => this\.checkSignaturePadVisibility\(\);\s*s2\.onchange = \(\) => this\.checkSignaturePadVisibility\(\);\s*s3\.onchange = \(\) => this\.checkSignaturePadVisibility\(\);\s*s4\.onchange = \(\) => this\.checkSignaturePadVisibility\(\);\s*\/\/ Reset pad when opening\s*if \(this\.clearSignaturePad\) this\.clearSignaturePad\(\);\s*if \(this\.checkSignaturePadVisibility\) this\.checkSignaturePadVisibility\(\);/g, 
`// Reset pad when opening
                const sysRadio = document.querySelector('input[name="pdfSignMode"][value="system"]');
                if(sysRadio) sysRadio.checked = true;
                if (this.clearSignaturePad) this.clearSignaturePad();
                if (this.toggleSignMode) this.toggleSignMode();`);

// In saveLogic, check pdfSignMode
js = js.replace(/const s1v = document\.getElementById\('sel-analyst-1'\)\.value;[\s\S]*?if \(s1v === 'draw' \|\| s2v === 'draw' \|\| a1v === 'draw' \|\| a2v === 'draw'\) \{[\s\S]*?if\(canvas\) \{[\s\S]*?sample\.custom_drawn_sig = canvas\.toDataURL\(\);[\s\S]*?\}[\s\S]*?\}/g, 
`const mode = document.querySelector('input[name="pdfSignMode"]:checked')?.value || 'system';
            sample.pdfSignMode = mode;
            if (mode === 'draw') {
                const canvas = document.getElementById('hybridSignaturePad');
                if(canvas) sample.custom_drawn_sig = canvas.toDataURL();
            } else {
                sample.custom_drawn_sig = null;
            }`);

// In renderSignatureSlot, rewrite it again
js = js.replace(/if \(personKey === 'wet'\) \{[\s\S]*?if \(!personKey \|\| !PERSON_DATA\[personKey\]\) \{/g, 
`if (sample.pdfSignMode === 'wet' && personKey) {
                // If wet signature is selected and there's a person chosen, just print their name and blank space
                const pName = PERSON_DATA[personKey]?.name || '';
                return \`
                    <div class="cert-signature-area" style="margin-top: 5px; width: 100%; text-align: center;">
                        <div style="display:flex; align-items:flex-start; justify-content:center; font-size: 11.5px;">
                            <div style="padding-top:25px;">ลงชื่อ</div>
                            <div style="display:flex; flex-direction:column; align-items:center;">
                                <div style="margin-top:25px; position:relative;">
                                    ................................................
                                </div>
                                <div style="width: 100%; display: flex; justify-content: center; margin-top:4px;">
                                    <div style="width: 0px; display: flex; flex-direction: column; align-items: center; white-space: nowrap; overflow: visible;">
                                        <div style="font-size: 11px; line-height: 1.3;">(\${pName})</div>
                                        <div style="font-size: 11px; line-height: 1.3;">\${defaultRole}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            if (!personKey || !PERSON_DATA[personKey]) {`);

// Also we need to handle sample.pdfSignMode === 'draw' inside renderSignatureSlot if personKey exists
// I'll replace the `<img src="\${p.sig}"...` part.
js = js.replace(/const sigHtml = \(viewOnly \|\| sample\.status === 'approved'\) \? \n\s*`<img src="\$\{p\.sig\}" class="official-signature-img" style="\$\{extraStyle\}" onerror="this\.style\.display='none'">` :/g, 
`let imgSrc = p.sig;
            if (sample.pdfSignMode === 'draw' && sample.custom_drawn_sig) {
                imgSrc = sample.custom_drawn_sig;
                // reset extra style for custom drawing so it doesn't get squished based on who they are
                extraStyle = 'max-height: 40px; margin-bottom: -5px; transform-origin: bottom center; margin-left: 0px;';
            }
            
            const sigHtml = (viewOnly || sample.status === 'approved' || sample.status === 'analyst_signed') ? 
                \`<img src="\${imgSrc}" class="official-signature-img" style="\${extraStyle}" onerror="this.style.display='none'">\` : `);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed JS logic');
