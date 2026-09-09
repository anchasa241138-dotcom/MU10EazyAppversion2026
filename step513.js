const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const saveLogic = `
            const s1v = document.getElementById('sel-analyst-1').value;
            const s2v = document.getElementById('sel-analyst-2').value;
            const a1v = document.getElementById('sel-approver-1').value;
            const a2v = document.getElementById('sel-approver-2').value;
            
            if (s1v === 'draw' || s2v === 'draw' || a1v === 'draw' || a2v === 'draw') {
                const canvas = document.getElementById('hybridSignaturePad');
                if(canvas) {
                    sample.custom_drawn_sig = canvas.toDataURL();
                }
            }
`;

js = js.replace(/if \(sample\.form_type === 'MU\.10-001' \|\| sample\.form_type === 'MU\.10-002'\) \{/,
    saveLogic + "\n" + "            if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002') {");

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Added save logic to handleApproveReport');
