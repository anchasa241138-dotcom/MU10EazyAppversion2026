const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const replacement = `
        const renderSignatureSlot = (personKey, defaultRole) => {
            // Mallika is locked to E-Signature only
            const isMallika = (personKey === 'mallika');
            
            if (sample.pdfSignMode === 'wet' && personKey && !isMallika) {
                // If wet signature is selected and there's a person chosen, just print their name and blank space
                const pName = PERSON_DATA[personKey]?.name || '';
                return \\\`
                    <div class="cert-signature-area" style="margin-top: 5px; width: 100%; text-align: center;">
                        <div style="display:flex; align-items:flex-start; justify-content:center; font-size: 11.5px;">
                            <div style="padding-top:25px;">ลงชื่อ</div>
                            <div style="display:flex; flex-direction:column; align-items:center;">
                                <div style="margin-top:25px; position:relative;">
                                    ................................................
                                </div>
                                <div style="width: 100%; display: flex; justify-content: center; margin-top:4px;">
                                    <div style="width: 0px; display: flex; flex-direction: column; align-items: center; white-space: nowrap; overflow: visible;">
                                        <div style="font-size: 11px; line-height: 1.3;">(\\\${pName})</div>
                                        <div style="font-size: 11px; line-height: 1.3;">\\\${defaultRole}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                \\\`;
            }
            if (!personKey || !PERSON_DATA[personKey]) {`;

js = js.replace(/const renderSignatureSlot = \(personKey, defaultRole\) => \{[\s\S]*?if \(!personKey \|\| !PERSON_DATA\[personKey\]\) \{/, replacement);

const replacement2 = `
            let imgSrc = p.sig;
            if (sample.pdfSignMode === 'draw' && sample.custom_drawn_sig && !isMallika) {
                imgSrc = sample.custom_drawn_sig;
                // reset extra style for custom drawing so it doesn't get squished based on who they are
                extraStyle = 'max-height: 40px; margin-bottom: -5px; transform-origin: bottom center; margin-left: 0px;';
            }
`;

js = js.replace(/let imgSrc = p\.sig;\s*if \(sample\.pdfSignMode === 'draw' && sample\.custom_drawn_sig\) \{[\s\S]*?\}/, replacement2);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Updated renderSignatureSlot for Mallika lockout');
