const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

// 1. Target block in renderAnalysisDynamicSection
let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let startIdx = js.indexOf("} else if (sample.form_type === 'MU.10-006') {", pos);
let endIdx = js.indexOf("} else if (sample.form_type === 'MU.10-008') {", startIdx);

const newRenderMu06 = `} else if (sample.form_type === 'MU.10-006') {
            const machines = [];
            let idx = 1;
            while (sample['sample_name_' + idx] !== undefined || sample['location_' + idx] !== undefined) {
                if (sample['sample_name_' + idx] || sample['location_' + idx]) {
                    machines.push({
                        idx: idx,
                        location: [sample['location_' + idx], sample['sample_name_' + idx]].filter(Boolean).join(' ') || sample.location_name || '-',
                        coliform: sample['analysis_coliform_' + idx] || '',
                        coliform_sum: sample['analysis_coliform_summary_' + idx] || '',
                        tds: sample['analysis_tds_' + idx] || '',
                        tds_sum: sample['analysis_tds_summary_' + idx] || '',
                        hardness: sample['analysis_hardness_' + idx] || '',
                        hardness_sum: sample['analysis_hardness_summary_' + idx] || '',
                        ph: sample['analysis_ph_' + idx] || '',
                        ph_sum: sample['analysis_ph_summary_' + idx] || ''
                    });
                }
                idx++;
            }
            if (machines.length === 0) {
                machines.push({
                    idx: 1,
                    location: sample.location_name || sample.sample_name || 'ตู้น้ำดื่ม 1',
                    coliform: sample.analysis_coliform_1 || '',
                    coliform_sum: sample.analysis_coliform_summary_1 || '',
                    tds: sample.analysis_tds_1 || '',
                    tds_sum: sample.analysis_tds_summary_1 || '',
                    hardness: sample.analysis_hardness_1 || '',
                    hardness_sum: sample.analysis_hardness_summary_1 || '',
                    ph: sample.analysis_ph_1 || '',
                    ph_sum: sample.analysis_ph_summary_1 || ''
                });
            }

            let rowsHTML = machines.map(m => {
                const cSum = m.coliform_sum || (m.coliform !== '' ? (parseFloat(m.coliform) === 0 ? 'ผ่าน' : 'ไม่ผ่าน') : 'ผ่าน');
                const tSum = m.tds_sum || (m.tds !== '' ? (parseFloat(m.tds) <= 50 ? 'เกณฑ์ปกติ' : 'ควรเปลี่ยนไส้กรอง') : 'เกณฑ์ปกติ');
                const hSum = m.hardness_sum || (m.hardness !== '' ? ((m.hardness.includes('<') || parseFloat(m.hardness) <= 100) ? 'ผ่าน' : 'ไม่ผ่าน') : 'ผ่าน');
                const pSum = m.ph_sum || (m.ph !== '' ? ((parseFloat(m.ph) >= 6.5 && parseFloat(m.ph) <= 8.5) ? 'ผ่าน' : 'ไม่ผ่าน') : 'ผ่าน');

                return \`
                    <tr style="text-align:center; vertical-align:middle;">
                        <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold;">\${m.idx}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; text-align:left; font-weight:500;">\${m.location}</td>
                        <!-- จุลชีววิทยา -->
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#f8fafc;">
                            <input type="number" id="analysis-coliform-\${m.idx}" value="\${m.coliform}" placeholder="0" min="0" style="width:65px; text-align:center; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;" oninput="app.calculateMu10006Row(\${m.idx})">
                        </td>
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#f8fafc;">
                            <select id="analysis-coliform-summary-\${m.idx}" style="padding:4px 6px; font-weight:bold; border-radius:4px; border:1px solid #cbd5e1; color:\${cSum === 'ไม่ผ่าน' ? '#dc2626' : '#16a34a'};" onchange="app.updateMu10006OverallSummary()">
                                <option value="ผ่าน" \${cSum === 'ผ่าน' ? 'selected' : ''}>ผ่าน</option>
                                <option value="ไม่ผ่าน" \${cSum === 'ไม่ผ่าน' ? 'selected' : ''}>ไม่ผ่าน</option>
                            </select>
                        </td>
                        <!-- เคมี: TDS -->
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#f0fdf4;">
                            <input type="number" step="0.1" id="analysis-tds-\${m.idx}" value="\${m.tds}" placeholder="25.4" style="width:75px; text-align:center; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;" oninput="app.calculateMu10006Row(\${m.idx})">
                        </td>
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#f0fdf4;">
                            <select id="analysis-tds-summary-\${m.idx}" style="padding:4px 6px; font-weight:bold; border-radius:4px; border:1px solid #cbd5e1; color:\${tSum === 'ควรเปลี่ยนไส้กรอง' ? '#dc2626' : '#16a34a'};" onchange="app.updateMu10006OverallSummary()">
                                <option value="เกณฑ์ปกติ" \${tSum === 'เกณฑ์ปกติ' ? 'selected' : ''}>เกณฑ์ปกติ</option>
                                <option value="ควรเปลี่ยนไส้กรอง" \${tSum === 'ควรเปลี่ยนไส้กรอง' ? 'selected' : ''}>ควรเปลี่ยนไส้กรอง</option>
                            </select>
                        </td>
                        <!-- เคมี: Hardness -->
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#f0fdf4;">
                            <input type="text" id="analysis-hardness-\${m.idx}" value="\${m.hardness}" placeholder="<50" style="width:70px; text-align:center; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;" oninput="app.calculateMu10006Row(\${m.idx})">
                        </td>
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#f0fdf4;">
                            <select id="analysis-hardness-summary-\${m.idx}" style="padding:4px 6px; font-weight:bold; border-radius:4px; border:1px solid #cbd5e1; color:\${hSum === 'ไม่ผ่าน' ? '#dc2626' : '#16a34a'};" onchange="app.updateMu10006OverallSummary()">
                                <option value="ผ่าน" \${hSum === 'ผ่าน' ? 'selected' : ''}>ผ่าน</option>
                                <option value="ไม่ผ่าน" \${hSum === 'ไม่ผ่าน' ? 'selected' : ''}>ไม่ผ่าน</option>
                            </select>
                        </td>
                        <!-- กายภาพ: pH -->
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#fefce8;">
                            <input type="number" step="0.01" id="analysis-ph-\${m.idx}" value="\${m.ph}" placeholder="7.5" style="width:70px; text-align:center; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;" oninput="app.calculateMu10006Row(\${m.idx})">
                        </td>
                        <td style="padding:4px; border:1px solid #cbd5e1; background:#fefce8;">
                            <select id="analysis-ph-summary-\${m.idx}" style="padding:4px 6px; font-weight:bold; border-radius:4px; border:1px solid #cbd5e1; color:\${pSum === 'ไม่ผ่าน' ? '#dc2626' : '#16a34a'};" onchange="app.updateMu10006OverallSummary()">
                                <option value="ผ่าน" \${pSum === 'ผ่าน' ? 'selected' : ''}>ผ่าน</option>
                                <option value="ไม่ผ่าน" \${pSum === 'ไม่ผ่าน' ? 'selected' : ''}>ไม่ผ่าน</option>
                            </select>
                        </td>
                    </tr>
                \`;
            }).join('');

            container.innerHTML = \`
                <div class="form-section-divider"><i class="fa-solid fa-flask"></i> ผลการตรวจวิเคราะห์น้ำบริโภคจากตู้น้ำดื่มอัตโนมัติ โดยชุดทดสอบเบื้องต้น (RD-006)</div>
                <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #cbd5e1; margin-bottom:15px; overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; font-size:12px; min-width:850px;" border="1">
                        <thead>
                            <tr style="text-align:center; font-weight:bold;">
                                <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:40px; background:#f8fafc;">ที่</th>
                                <th rowspan="2" style="padding:6px; border:1px solid #cbd5e1; width:160px; background:#f8fafc;">ชื่อสถานที่</th>
                                <th colspan="2" style="padding:6px; border:1px solid #cbd5e1; background:#f1f5f9; color:#1e293b;">วิเคราะห์ทางจุลชีววิทยา</th>
                                <th colspan="4" style="padding:6px; border:1px solid #cbd5e1; background:#dcfce7; color:#14532d;">วิเคราะห์ทางเคมี</th>
                                <th colspan="2" style="padding:6px; border:1px solid #cbd5e1; background:#fef9c3; color:#713f12;">วิเคราะห์ทางกายภาพ</th>
                            </tr>
                            <tr style="text-align:center; font-weight:bold; font-size:11.5px;">
                                <th style="padding:4px; border:1px solid #cbd5e1; background:#f1f5f9;">Coliform<br><span style="font-size:10px; font-weight:normal;">(ต้องไม่พบ)</span></th>
                                <th style="padding:4px; border:1px solid #cbd5e1; background:#f1f5f9; width:80px;">สรุปผล</th>
                                <th colspan="2" style="padding:4px; border:1px solid #cbd5e1; background:#dcfce7;">TDS (≤ 50 มก./ล.)<br><span style="font-size:10px; font-weight:normal;">ค่าตรวจพบ / สรุปผล</span></th>
                                <th colspan="2" style="padding:4px; border:1px solid #cbd5e1; background:#dcfce7;">Hardness (≤ 100 มก./ล.)<br><span style="font-size:10px; font-weight:normal;">ค่าตรวจพบ / สรุปผล</span></th>
                                <th colspan="2" style="padding:4px; border:1px solid #cbd5e1; background:#fef9c3;">pH (6.5-8.5)<br><span style="font-size:10px; font-weight:normal;">ค่าตรวจพบ / สรุปผล</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            \${rowsHTML}
                        </tbody>
                    </table>

                    <div style="font-size:11.5px; color:#64748b; margin-top:8px;">
                        * <em>ระบบจะประเมินผลอัตโนมัติขณะกรอกตัวเลข (Coliform: 0=ผ่าน, TDS ≤ 50=เกณฑ์ปกติ, Hardness ≤ 100=ผ่าน, pH 6.5-8.5=ผ่าน)</em>
                    </div>

                    <div class="form-grid" style="margin-top:14px; padding-top:12px; border-top:1px dashed #e2e8f0;">
                        <div class="form-group">
                            <label for="analysis-summary-outcome">สรุปผลภาพรวม <span class="required">*</span></label>
                            <select id="analysis-summary-outcome" required style="width:100%; height:40px; padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; font-size:14px; font-weight:bold;">
                                <option value="ผ่าน" \${sample.analysis_summary !== 'ไม่ผ่าน' ? 'selected' : ''}>ผ่าน</option>
                                <option value="ไม่ผ่าน" \${sample.analysis_summary === 'ไม่ผ่าน' ? 'selected' : ''}>ไม่ผ่าน</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="analysis-comment">ข้อคิดเห็น / ข้อเสนอแนะเพิ่มเติม</label>
                            <input type="text" id="analysis-comment" value="\${sample.analysis_comment || ''}" placeholder="ระบุข้อคิดเห็น (ถ้ามี)" style="width:100%; height:40px; padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; font-size:14px;">
                        </div>
                    </div>
                </div>
            \`;
        `;

js = js.substring(0, startIdx) + newRenderMu06 + js.substring(endIdx);

// 2. Add helper methods to app
const helperMethods = `
    calculateMu10006Row(idx) {
        // Coliform
        const cEl = document.getElementById('analysis-coliform-' + idx);
        const cSumEl = document.getElementById('analysis-coliform-summary-' + idx);
        if (cEl && cSumEl && cEl.value !== '') {
            const val = parseFloat(cEl.value);
            if (!isNaN(val)) {
                cSumEl.value = val === 0 ? 'ผ่าน' : 'ไม่ผ่าน';
                cSumEl.style.color = val === 0 ? '#16a34a' : '#dc2626';
            }
        }

        // TDS
        const tEl = document.getElementById('analysis-tds-' + idx);
        const tSumEl = document.getElementById('analysis-tds-summary-' + idx);
        if (tEl && tSumEl && tEl.value !== '') {
            const val = parseFloat(tEl.value);
            if (!isNaN(val)) {
                tSumEl.value = val <= 50 ? 'เกณฑ์ปกติ' : 'ควรเปลี่ยนไส้กรอง';
                tSumEl.style.color = val <= 50 ? '#16a34a' : '#dc2626';
            }
        }

        // Hardness
        const hEl = document.getElementById('analysis-hardness-' + idx);
        const hSumEl = document.getElementById('analysis-hardness-summary-' + idx);
        if (hEl && hSumEl && hEl.value !== '') {
            let num = parseFloat(hEl.value.replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) {
                hSumEl.value = num <= 100 ? 'ผ่าน' : 'ไม่ผ่าน';
                hSumEl.style.color = num <= 100 ? '#16a34a' : '#dc2626';
            } else if (hEl.value.includes('<')) {
                hSumEl.value = 'ผ่าน';
                hSumEl.style.color = '#16a34a';
            }
        }

        // pH
        const pEl = document.getElementById('analysis-ph-' + idx);
        const pSumEl = document.getElementById('analysis-ph-summary-' + idx);
        if (pEl && pSumEl && pEl.value !== '') {
            const val = parseFloat(pEl.value);
            if (!isNaN(val)) {
                const pass = val >= 6.5 && val <= 8.5;
                pSumEl.value = pass ? 'ผ่าน' : 'ไม่ผ่าน';
                pSumEl.style.color = pass ? '#16a34a' : '#dc2626';
            }
        }

        this.updateMu10006OverallSummary();
    },

    updateMu10006OverallSummary() {
        const overallSelect = document.getElementById('analysis-summary-outcome');
        if (!overallSelect) return;

        let allPass = true;
        let count = 0;
        document.querySelectorAll('[id^="analysis-coliform-summary-"]').forEach(sel => {
            count++;
            if (sel.value === 'ไม่ผ่าน') allPass = false;
        });
        document.querySelectorAll('[id^="analysis-tds-summary-"]').forEach(sel => {
            if (sel.value === 'ควรเปลี่ยนไส้กรอง') allPass = false;
        });
        document.querySelectorAll('[id^="analysis-hardness-summary-"]').forEach(sel => {
            if (sel.value === 'ไม่ผ่าน') allPass = false;
        });
        document.querySelectorAll('[id^="analysis-ph-summary-"]').forEach(sel => {
            if (sel.value === 'ไม่ผ่าน') allPass = false;
        });

        if (count > 0) {
            overallSelect.value = allPass ? 'ผ่าน' : 'ไม่ผ่าน';
        }
    },
`;

// Insert helper methods before handleMu10004InterpretationChange
if (!js.includes('calculateMu10006Row(idx)')) {
    js = js.replace('handleMu10004InterpretationChange(idx) {', helperMethods + '\n    handleMu10004InterpretationChange(idx) {');
}

// 3. Save MU.10-006 fields in handleSaveAnalysis
const saveMu06Block = `            } else if (sample.form_type === 'MU.10-006') {
                let idx = 1;
                let allPassed = true;
                let anyFilled = false;
                while (sample['sample_name_' + idx] !== undefined || sample['location_' + idx] !== undefined) {
                    const coliform = document.getElementById('analysis-coliform-' + idx)?.value;
                    const coliformSum = document.getElementById('analysis-coliform-summary-' + idx)?.value;
                    const tds = document.getElementById('analysis-tds-' + idx)?.value;
                    const tdsSum = document.getElementById('analysis-tds-summary-' + idx)?.value;
                    const hardness = document.getElementById('analysis-hardness-' + idx)?.value;
                    const hardnessSum = document.getElementById('analysis-hardness-summary-' + idx)?.value;
                    const ph = document.getElementById('analysis-ph-' + idx)?.value;
                    const phSum = document.getElementById('analysis-ph-summary-' + idx)?.value;

                    sample['analysis_coliform_' + idx] = coliform || '';
                    sample['analysis_coliform_summary_' + idx] = coliformSum || '';
                    sample['analysis_tds_' + idx] = tds || '';
                    sample['analysis_tds_summary_' + idx] = tdsSum || '';
                    sample['analysis_hardness_' + idx] = hardness || '';
                    sample['analysis_hardness_summary_' + idx] = hardnessSum || '';
                    sample['analysis_ph_' + idx] = ph || '';
                    sample['analysis_ph_summary_' + idx] = phSum || '';

                    if (coliformSum || tdsSum || hardnessSum || phSum) anyFilled = true;
                    if (coliformSum === 'ไม่ผ่าน' || tdsSum === 'ควรเปลี่ยนไส้กรอง' || hardnessSum === 'ไม่ผ่าน' || phSum === 'ไม่ผ่าน') {
                        allPassed = false;
                    }
                    idx++;
                }

                const summaryOutcome = document.getElementById('analysis-summary-outcome')?.value;
                if (summaryOutcome) {
                    sample.analysis_summary = summaryOutcome;
                } else {
                    sample.analysis_summary = (anyFilled && allPassed) ? 'ผ่าน' : (anyFilled && !allPassed ? 'ไม่ผ่าน' : 'ผ่าน');
                }
                sample.analysis_details = 'Coliform, TDS, Hardness, pH';
`;

if (!js.includes("sample.form_type === 'MU.10-006'") || !js.includes("analysis_coliform_")) {
    let saveTarget = "} else if (sample.form_type === 'MU.10-002') {";
    let savePos = js.indexOf(saveTarget);
    if (savePos !== -1) {
        js = js.substring(0, savePos) + saveMu06Block + js.substring(savePos);
        console.log('Inserted save logic for MU.10-006 in handleSaveAnalysis');
    }
}

fs.writeFileSync('app_v84.js', js, 'utf8');
console.log('Successfully written changes to app_v84.js!');