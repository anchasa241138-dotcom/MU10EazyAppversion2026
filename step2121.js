const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const regex = /const total = visible\.length;\s*const pending = visible\.filter\(s => s\.status === 'registered'\)\.length;\s*const analyzing = visible\.filter\(s => s\.status === 'accepted'\)\.length;\s*const completed = visible\.filter\(s => s\.status === 'approved'\)\.length;\s*const passed = visible\.filter\(s => s\.status === 'approved' && s\.analysis_summary === '.*?'\)\.length;\s*const failed = visible\.filter\(s => s\.status === 'approved' && s\.analysis_summary === '.*?'\)\.length;/s;

const newCode = `let cStats = { total: 0, pending: 0, analyzing: 0, completed: 0, passed: 0, failed: 0 };
        visible.forEach(s => {
            let idx = 1;
            let hasItems = false;
            
            const processItem = (index) => {
                hasItems = true;
                cStats.total++;
                
                if (s.status === 'registered') cStats.pending++;
                else if (s.status === 'accepted' || s.status === 'analyzed' || s.status === 'summarized' || s.status === 'analyst_signed') cStats.analyzing++;
                else if (s.status === 'approved') {
                    cStats.completed++;
                    let sum = index ? (s['analysis_summary_outcome_' + index] || s['analysis_summary_' + index] || '') : (s['analysis_summary_outcome'] || s['analysis_summary'] || '');
                    if (sum.includes('ไม่ผ่าน')) cStats.failed++;
                    else if (sum.includes('ผ่าน')) cStats.passed++;
                }
            };

            while (s['sample_name_' + idx] !== undefined) {
                processItem(idx);
                idx++;
            }
            if (!hasItems && s.sample_name) {
                processItem(null);
            }
        });

        const total = cStats.total;
        const pending = cStats.pending;
        const analyzing = cStats.analyzing;
        const completed = cStats.completed;
        const passed = cStats.passed;
        const failed = cStats.failed;`;

if (regex.test(js)) {
    js = js.replace(regex, newCode);
    fs.writeFileSync('app_v83.js', js);
    console.log('Successfully replaced counting logic in app_v83.js');
} else {
    console.log('Regex did not match!');
}