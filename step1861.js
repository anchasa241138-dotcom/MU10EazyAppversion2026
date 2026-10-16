const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// 1. Update renderAnalysisDynamicSection
const renderTarget = `            if (sample.analysis_comment) {
                const commentEl = document.getElementById('analysis-comment');
                if (commentEl) commentEl.value = sample.analysis_comment;
            }
        } else {
            // Generic form for other form types`;
            
const renderInjection = `            if (sample.analysis_comment) {
                const commentEl = document.getElementById('analysis-comment');
                if (commentEl) commentEl.value = sample.analysis_comment;
            }
        } else if (sample.form_type === 'MU.10-005') {
            const sampleNames = [];
            let idx = 1;
            while (sample['sample_name_' + idx] !== undefined) {
                if (sample['sample_name_' + idx]) {
                    sampleNames.push({ name: sample['sample_name_' + idx], idx: idx });
                }
                idx++;
            }
            if (sampleNames.length === 0) {
                sampleNames.push({ name: sample.sample_name || 'ตัวอย่างที่ 1', idx: 1 });
            }

            let html = '<div class="form-section-divider"><i class="fa-solid fa-microscope"></i> ผลการตรวจวิเคราะห์ (' + sample.form_type + ')</div>';

            sampleNames.forEach(item => {
                html += \`<div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:15px;">
                            <h5 style="margin-top:0; color:#0f172a; font-weight:bold; border-bottom:1px solid #cbd5e1; padding-bottom:8px; margin-bottom:12px;">ตัวอย่าง: \${item.name}</h5>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>ค่าไอโอเดท (ppm) <span class="required">*</span></label>
                                    <input type="number" step="0.1" id="analysis-iodate-\${item.idx}" required placeholder="ระบุค่า ppm" oninput="app.calculateMu10005Outcome('\${item.idx}')">
                                </div>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>สรุปผล <span class="required">*</span></label>
                                    <input type="text" id="analysis-summary-outcome-\${item.idx}" readonly class="readonly-input" style="font-weight:700; font-size:14px;">
                                    <span class="input-helper">ออโต้: ผ่าน (20-40 ppm)</span>
                                </div>
                            </div>
                        </div>\`;
            });

            html += \`
                <div class="form-group">
                    <label for="analysis-comment">หมายเหตุเพิ่มเติม</label>
                    <input type="text" id="analysis-comment" placeholder="คำชี้แจงเพิ่มเติมถ้ามี">
                </div>
            \`;

            container.innerHTML = html;

            sampleNames.forEach(item => {
                const iodateVal = sample[\`iodate_value_\${item.idx}\`];
                if (iodateVal) {
                    const el = document.getElementById(\`analysis-iodate-\${item.idx}\`);
                    if (el) {
                        el.value = iodateVal;
                        app.calculateMu10005Outcome(item.idx);
                    }
                }
            });
            if (sample.analysis_comment) {
                const commentEl = document.getElementById('analysis-comment');
                if (commentEl) commentEl.value = sample.analysis_comment;
            }
        } else {
            // Generic form for other form types`;

js = js.replace(renderTarget, renderInjection);

// 2. Add calculateMu10005Outcome method
const appEndTarget = `    // Initialization
    init() {`;
    
const calcMethod = `    calculateMu10005Outcome(idx) {
        const iodateEl = document.getElementById('analysis-iodate-' + idx);
        const summaryEl = document.getElementById('analysis-summary-outcome-' + idx);
        if (iodateEl && summaryEl) {
            const val = parseFloat(iodateEl.value);
            if (!isNaN(val)) {
                if (val >= 20 && val <= 40) {
                    summaryEl.value = 'ผ่าน';
                    summaryEl.style.color = 'green';
                } else {
                    summaryEl.value = 'ไม่ผ่าน';
                    summaryEl.style.color = 'red';
                }
            } else {
                summaryEl.value = '';
            }
        }
    },

    // Initialization
    init() {`;
    
js = js.replace(appEndTarget, calcMethod);

// 3. Update handleSaveAnalysis
const saveTarget = `                  // Set overall summary string for table views
                  let overallSummary = '-';
                  if (passCount === totalCount && totalCount > 0) {
                      overallSummary = 'ผ่าน';
                  } else if (passCount === 0) {
                      overallSummary = 'ไม่ผ่าน';
                  } else {
                      overallSummary = \`ผ่าน \${passCount} / ไม่ผ่าน \${totalCount - passCount}\`;
                  }
                  sample.analysis_summary = overallSummary;
              } else if (sample.form_type === 'MU.10-004') {`; // Wait, let's use something generic inside saveAnalysis. I'll search for MU.10-004 in saveAnalysis instead.

// let's do the saveAnalysis replacement safely in next step.
fs.writeFileSync('app_v83.js', js);
console.log("Injected render block and calc method.");