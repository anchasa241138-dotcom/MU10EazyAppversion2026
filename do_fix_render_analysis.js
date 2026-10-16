const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf('renderAnalysisDynamicSection(sample) {');
let startIdx = js.indexOf("} else if (sample.form_type === 'MU.10-006') {", pos);
let endIdx = js.indexOf("} else if (sample.form_type === 'MU.10-008') {", startIdx);

console.log('Replacing from', startIdx, 'to', endIdx);

const replacement = `} else if (sample.form_type === 'MU.10-006') {
            const machines = [];
            let idx = 1;
            while (sample['sample_name_' + idx] !== undefined || sample['location_' + idx] !== undefined) {
                if (sample['sample_name_' + idx] || sample['location_' + idx]) {
                    const advice = (sample['ocpb_advice_' + idx] === 'on' || sample['ocpb_advice_' + idx] === true) ? '✓' : '-';
                    const filter = (sample['ocpb_filter_date_' + idx] === 'on' || sample['ocpb_filter_date_' + idx] === true) ? '✓' : '-';
                    const warn = (sample['ocpb_warning_' + idx] === 'on' || sample['ocpb_warning_' + idx] === true) ? '✓' : '-';
                    const mag = (sample['claim_magnetic_' + idx] === 'on' || sample['claim_magnetic_' + idx] === true) ? '✓' : '-';
                    const mol = (sample['claim_molecule_' + idx] === 'on' || sample['claim_molecule_' + idx] === true) ? '✓' : '-';

                    machines.push({
                        idx: idx,
                        amphoe: sample['amphoe_' + idx] || '-',
                        location: sample['location_' + idx] || '-',
                        name: sample['sample_name_' + idx] || '-',
                        company: sample['company_' + idx] || '-',
                        system: sample['system_' + idx] || '-',
                        advice: advice,
                        filter: filter,
                        warn: warn,
                        mag: mag,
                        mol: mol,
                        claim_other: sample['claim_other_' + idx] || '-',
                        remark: sample['remark_' + idx] || '-'
                    });
                }
                idx++;
            }
            if (machines.length === 0) {
                machines.push({
                    idx: 1,
                    amphoe: sample.amphoe || '-',
                    location: sample.location_name || '-',
                    name: sample.sample_name || '-',
                    company: '-',
                    system: '-',
                    advice: '-', filter: '-', warn: '-', mag: '-', mol: '-', claim_other: '-', remark: '-'
                });
            }

            container.innerHTML = \`
                <div class="form-section-divider"><i class="fa-solid fa-glass-water"></i> ตรวจสอบข้อมูลตู้น้ำดื่มหยอดเหรียญ (MU.10-006)</div>
                <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:15px; overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; font-size:12.5px; margin-bottom:15px;" border="1">
                        <thead>
                            <tr style="background:#f1f5f9; text-align:center;">
                                <th style="padding:6px; border:1px solid #cbd5e1;">ลำดับ</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">อำเภอ</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">สถานที่</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">ชื่อตู้/ยี่ห้อ</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">ชื่อบริษัท</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">ระบบ</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">ข้อแนะนำ</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">เปลี่ยนไส้กรอง</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">คำเตือน</th>
                                <th style="padding:6px; border:1px solid #cbd5e1;">หมายเหตุ</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${machines.map(m => \`
                                <tr style="text-align:center;">
                                    <td style="padding:6px; border:1px solid #cbd5e1;">\${m.idx}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1;">\${m.amphoe}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">\${m.location}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">\${m.name}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">\${m.company}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1;">\${m.system}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1;">\${m.advice}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1;">\${m.filter}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1;">\${m.warn}</td>
                                    <td style="padding:6px; border:1px solid #cbd5e1; text-align:left;">\${m.remark}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="analysis-summary-outcome">ผลการตรวจสอบ <span class="required">*</span></label>
                            <select id="analysis-summary-outcome" required style="width:100%; height:40px; padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; font-size:14px;">
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

js = js.substring(0, startIdx) + replacement + js.substring(endIdx);
fs.writeFileSync('app_v84.js', js, 'utf8');
console.log('Successfully updated renderAnalysisDynamicSection for MU.10-006!');