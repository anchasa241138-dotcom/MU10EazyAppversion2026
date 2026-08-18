const fs = require('fs');
let code = fs.readFileSync('app_v49_23.js', 'utf8');

const regex = /\} else if \(sample\.status === 'analyst_signed'\) \{([\s\S]*?)\}/;
const replace = `} else if (sample.status === 'analyst_signed' || sample.status === 'approved') {
                    sample.sel_analyst_1 = document.getElementById('sel-analyst-1').value;
                    sample.sel_analyst_2 = document.getElementById('sel-analyst-2').value;
                    sample.sel_approver_1 = document.getElementById('sel-approver-1').value;
                    sample.sel_approver_2 = document.getElementById('sel-approver-2').value;
                    sample.approver_name = "MU.10-001 System"; // placeholder
                    sample.status = 'approved';
                }`;

code = code.replace(regex, replace);
fs.writeFileSync('app_v49_23.js', code, 'utf8');
console.log('Fixed handleApproveReport for approved status');
