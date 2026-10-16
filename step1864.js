const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const targetStr = `                    sample.analysis_details = 'ดูรายละเอียดในใบรายงานผล';
                }
            }`;

const injectionStr = `                    sample.analysis_details = 'ดูรายละเอียดในใบรายงานผล';
                }
            } else if (sample.form_type === 'MU.10-005') {
                let passCount = 0;
                let totalCount = 0;
                let idx = 1;
                while (sample['sample_name_' + idx] !== undefined) {
                    if (sample['sample_name_' + idx]) {
                        const iodateEl = document.getElementById('analysis-iodate-' + idx);
                        if (iodateEl) {
                            totalCount++;
                            sample['iodate_value_' + idx] = iodateEl.value;
                            sample['analysis_iodate_' + idx] = iodateEl.value;
                            const summary = document.getElementById('analysis-summary-outcome-' + idx)?.value || '';
                            sample['test_outcome_' + idx] = summary;
                            sample['analysis_summary_' + idx] = summary;
                            if (summary === 'ผ่าน') passCount++;
                        }
                    }
                    idx++;
                }
                
                // Fallback check
                if (totalCount === 0) {
                    const iodateEl = document.getElementById('analysis-iodate-1');
                    if (iodateEl) {
                        totalCount++;
                        sample['iodate_value_1'] = iodateEl.value;
                        sample['analysis_iodate_1'] = iodateEl.value;
                        const summary = document.getElementById('analysis-summary-outcome-1')?.value || '';
                        sample['test_outcome_1'] = summary;
                        sample['analysis_summary_1'] = summary;
                        if (summary === 'ผ่าน') passCount++;
                    }
                }

                if (totalCount > 0) {
                    if (passCount === totalCount) {
                        sample.analysis_summary = 'ผ่าน';
                    } else if (passCount === 0) {
                        sample.analysis_summary = 'ไม่ผ่าน';
                    } else {
                        sample.analysis_summary = \`ผ่าน \${passCount} / ไม่ผ่าน \${totalCount - passCount}\`;
                    }
                }
            }`;

if (js.includes(targetStr)) {
    js = js.replace(targetStr, injectionStr);
    fs.writeFileSync('app_v83.js', js);
    console.log("Injected save block.");
} else {
    console.log("Could not find target string.");
}