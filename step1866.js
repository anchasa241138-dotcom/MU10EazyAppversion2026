const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const calcMethod = `    calculateMu10005Outcome(idx) {
        const iodateEl = document.getElementById('analysis-iodate-' + idx);
        const summaryEl = document.getElementById('analysis-summary-outcome-' + idx);
        if (iodateEl && summaryEl) {
            const val = parseFloat(iodateEl.value);
            if (!isNaN(val)) {
                if (val >= 20 && val <= 40) {
                    summaryEl.value = 'ผ่าน';
                    summaryEl.style.color = '#15803d'; // dark green
                } else {
                    summaryEl.value = 'ไม่ผ่าน';
                    summaryEl.style.color = '#dc2626'; // red
                }
            } else {
                summaryEl.value = '';
            }
        }
    },

    init() {`;

js = js.replace('    init() {', calcMethod);
fs.writeFileSync('app_v83.js', js);
console.log("Method added.");