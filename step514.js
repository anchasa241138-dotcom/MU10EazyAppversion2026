const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const replaceLogic = `
        const renderSignatureSlot = (personKey, defaultRole) => {
            if (personKey === 'wet') {
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
                                        <div style="font-size: 11px; line-height: 1.3;">(................................................)</div>
                                        <div style="font-size: 11px; line-height: 1.3;">\${defaultRole}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            if (personKey === 'draw' && sample.custom_drawn_sig) {
                return \`
                    <div class="cert-signature-area" style="margin-top: 5px; width: 100%; text-align: center;">
                        <div style="display:flex; align-items:flex-start; justify-content:center; font-size: 11.5px;">
                            <div style="padding-top:25px;">ลงชื่อ</div>
                            <div style="display:flex; flex-direction:column; align-items:center;">
                                <div style="margin-top:25px; position:relative;">
                                    <div style="position:absolute; bottom: 5px; text-align:center; width:100%;">
                                        <img src="\${sample.custom_drawn_sig}" style="max-height: 40px; margin-bottom: -5px; transform-origin: bottom center;">
                                    </div>
                                    ................................................
                                </div>
                                <div style="width: 100%; display: flex; justify-content: center; margin-top:4px;">
                                    <div style="width: 0px; display: flex; flex-direction: column; align-items: center; white-space: nowrap; overflow: visible;">
                                        <div style="font-size: 11px; line-height: 1.3;">(ลายมือชื่ออิเล็กทรอนิกส์)</div>
                                        <div style="font-size: 11px; line-height: 1.3;">\${defaultRole}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            if (!personKey || !PERSON_DATA[personKey]) {`;

js = js.replace(/const renderSignatureSlot = \(personKey, defaultRole\) => \{\s*if \(!personKey \|\| !PERSON_DATA\[personKey\]\) \{/, replaceLogic);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Updated renderSignatureSlot');
