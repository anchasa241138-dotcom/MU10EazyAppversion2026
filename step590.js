const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const replacement = `
                    s1.value = sample.sel_analyst_1 || "anchasa";
                    s2.value = sample.sel_analyst_2 || "surachai";
                    s3.value = "";
                    s4.value = "";
                    
                    document.getElementById('mode-analyst-1').value = sample.mode_analyst_1 || 'system';
                    document.getElementById('mode-analyst-2').value = sample.mode_analyst_2 || 'system';
                    document.getElementById('mode-approver-1').value = sample.mode_approver_1 || 'system';
`;
js = js.replace(/                    s1\.value = sample\.sel_analyst_1 \|\| "anchasa";\s*s2\.value = sample\.sel_analyst_2 \|\| "surachai";\s*s3\.value = "";\s*s4\.value = "";/, replacement);

const replacement2 = `
                    s1.value = sample.sel_analyst_1 || "anchasa";
                    s2.value = sample.sel_analyst_2 || "surachai";
                    s3.value = sample.sel_approver_1 || "thitiporn";
                    s4.value = sample.sel_approver_2 || "mallika";
                    
                    document.getElementById('mode-analyst-1').value = sample.mode_analyst_1 || 'system';
                    document.getElementById('mode-analyst-2').value = sample.mode_analyst_2 || 'system';
                    document.getElementById('mode-approver-1').value = sample.mode_approver_1 || 'system';
`;
js = js.replace(/                    s1\.value = sample\.sel_analyst_1 \|\| "anchasa";\s*s2\.value = sample\.sel_analyst_2 \|\| "surachai";\s*s3\.value = sample\.sel_approver_1 \|\| "thitiporn";\s*s4\.value = sample\.sel_approver_2 \|\| "mallika";/, replacement2);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Updated openCertifyModal to load saved modes');
