const fs = require('fs');
let code = fs.readFileSync('app_v49_23.js', 'utf8');

const regex = /\} else if \(sample\.status === 'analyst_signed'\) \{([\s\S]*?)\}/;
const replace = `} else if (sample.status === 'analyst_signed' || (sample.status === 'approved' && forceEdit)) {
                    s1.value = sample.sel_analyst_1 || "anchasa";
                    s2.value = sample.sel_analyst_2 || "surachai";
                    s3.value = sample.sel_approver_1 || "thitiporn";
                    s4.value = sample.sel_approver_2 || "mallika";
                    s1.disabled = false; s2.disabled = false;
                    s3.disabled = false; s4.disabled = true;
                    btnApprove.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึกการเปลี่ยนแปลง';
                    btnApprove.style.display = 'inline-block';
                }`;

code = code.replace(regex, replace);
fs.writeFileSync('app_v49_23.js', code, 'utf8');
console.log('Fixed forceEdit for MU.10-001');
