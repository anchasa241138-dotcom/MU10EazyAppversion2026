const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const replacementViewOnly = `
                    s1.value = sample.sel_analyst_1 || "";
                    s2.value = sample.sel_analyst_2 || "";
                    s3.value = sample.sel_approver_1 || "";
                    s4.value = sample.sel_approver_2 || "";
                    
                    const m1 = document.getElementById('mode-analyst-1');
                    const m2 = document.getElementById('mode-analyst-2');
                    const m3 = document.getElementById('mode-approver-1');
                    if(m1) { m1.value = sample.mode_analyst_1 || 'system'; m1.disabled = true; }
                    if(m2) { m2.value = sample.mode_analyst_2 || 'system'; m2.disabled = true; }
                    if(m3) { m3.value = sample.mode_approver_1 || 'system'; m3.disabled = true; }
`;
js = js.replace(/                    s1\.value = sample\.sel_analyst_1 \|\| "";\s*s2\.value = sample\.sel_analyst_2 \|\| "";\s*s3\.value = sample\.sel_approver_1 \|\| "";\s*s4\.value = sample\.sel_approver_2 \|\| "";/, replacementViewOnly);

// Also need to enable them if not viewOnly!
const replacementEnable = `
                    s1.disabled = false; s2.disabled = false;
                    s3.disabled = true; s4.disabled = true;
                    
                    const m1 = document.getElementById('mode-analyst-1');
                    const m2 = document.getElementById('mode-analyst-2');
                    const m3 = document.getElementById('mode-approver-1');
                    if(m1) m1.disabled = false;
                    if(m2) m2.disabled = false;
                    if(m3) m3.disabled = true;
`;
js = js.replace(/                    s1\.disabled = false; s2\.disabled = false;\s*s3\.disabled = true; s4\.disabled = true;/, replacementEnable);

const replacementEnableAll = `
                    s1.disabled = false; s2.disabled = false;
                    s3.disabled = false; s4.disabled = true;
                    
                    const m1 = document.getElementById('mode-analyst-1');
                    const m2 = document.getElementById('mode-analyst-2');
                    const m3 = document.getElementById('mode-approver-1');
                    if(m1) m1.disabled = false;
                    if(m2) m2.disabled = false;
                    if(m3) m3.disabled = false;
`;
js = js.replace(/                    s1\.disabled = false; s2\.disabled = false;\s*s3\.disabled = false; s4\.disabled = true;/, replacementEnableAll);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed disabled states');
