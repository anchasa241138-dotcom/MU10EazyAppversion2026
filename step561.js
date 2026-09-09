const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

// 1. Remove the floating block from openCertifyModal
js = js.replace(/            const mode = document\.querySelector\('input\[name="pdfSignMode"\]:checked'\)\?.value \|\| 'system';\s*sample\.pdfSignMode = mode;\s*if \(mode === 'draw'\) \{\s*const canvas = document\.getElementById\('hybridSignaturePad'\);\s*if\(canvas\) sample\.custom_drawn_sig = canvas\.toDataURL\(\);\s*\} else \{\s*sample\.custom_drawn_sig = null;\s*\}/, '');

// 2. Insert it into handleApproveReport right before saving
const inject = `
            if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002') {
                const mode = document.querySelector('input[name="pdfSignMode"]:checked')?.value || 'system';
                sample.pdfSignMode = mode;
                if (mode === 'draw') {
                    const canvas = document.getElementById('hybridSignaturePad');
                    if(canvas) sample.custom_drawn_sig = canvas.toDataURL();
                } else {
                    sample.custom_drawn_sig = null;
                }
`;

js = js.replace(/            if \(sample\.form_type === 'MU\.10-001' \|\| sample\.form_type === 'MU\.10-002'\) \{/, inject);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Moved signature saving logic to handleApproveReport');
