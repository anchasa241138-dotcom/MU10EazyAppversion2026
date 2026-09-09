const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

// Undo the injection in downloadSubmissionPDFDirect
js = js.replace(/            if \(sample\.form_type === 'MU\.10-001' \|\| sample\.form_type === 'MU\.10-002'\) \{\n                const mode = document\.querySelector\('input\[name="pdfSignMode"\]:checked'\)\?.value \|\| 'system';\n                sample\.pdfSignMode = mode;\n                if \(mode === 'draw'\) \{\n                    const canvas = document\.getElementById\('hybridSignaturePad'\);\n                    if\(canvas\) sample\.custom_drawn_sig = canvas\.toDataURL\(\);\n                \} else \{\n                    sample\.custom_drawn_sig = null;\n                \}\n/, `            if (sample.form_type === 'MU.10-001' || sample.form_type === 'MU.10-002') {\n`);

// Inject correctly into handleApproveReport
const handleApproveLogic = `
    handleApproveReport(e) {
        try {
            const refId = e.currentTarget.dataset.refId || document.getElementById('btnApproveAndSign').dataset.refId;
            const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
            if (sampleIndex === -1) {
                alert("Error: sampleIndex is -1 for refId: " + refId);
                return;
            }
            const sample = this.samples[sampleIndex];

            // Save signature format and custom drawing if present
            if (document.getElementById('hybridSignaturePad')) {
                const mode = document.querySelector('input[name="pdfSignMode"]:checked')?.value || 'system';
                sample.pdfSignMode = mode;
                if (mode === 'draw') {
                    const canvas = document.getElementById('hybridSignaturePad');
                    if(canvas) sample.custom_drawn_sig = canvas.toDataURL();
                } else {
                    sample.custom_drawn_sig = null;
                }
            }
`;

js = js.replace(/    handleApproveReport\(e\) \{[\s\S]*?const sample = this\.samples\[sampleIndex\];/, handleApproveLogic);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed injection');
