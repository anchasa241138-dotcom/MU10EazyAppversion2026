const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const mu1008TableRowsHTML = `        } else if (sample.form_type === 'MU.10-008') {
            let passCount = 0;
            let totalCount = 0;
            
            let tableRowsHTML = '';
            sampleItems.forEach((item, i) => {
                if (item.name) {
                    totalCount++;
                    if (item.label_summary === 'ผ่าน') passCount++;
                    tableRowsHTML += \`
                        <tr style="height: 40px; page-break-inside: avoid; text-align: center;"> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${i + 1}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.distributor}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.name}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.food_serial_no}</td> 
                            <td style="padding:4px; text-align:left; font-size:14px; border:1px solid #555;">\${item.manufacturer_info}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.has_ingredient_pct}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.has_mfg_exp}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.net_weight}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.label_summary}</td> 
                        </tr>\`;
                }
            });
            
            const passPct = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(0) : 0;
            const analyst1 = sample.analysis_analyst || '..............................................';
            const analystPos = sample.analysis_analyst ? (sample.analysis_analyst_position || '..............................................') : '..............................................';
            const analysisDate = sample.analysis_date ? new Date(sample.analysis_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric'}) : '............................................';
            
            htmlContent = \`
                <div class="pdf-container" style="background:white; color:black; font-family:'Sarabun', sans-serif; max-width: 100%; margin: 0 auto; box-sizing:border-box;">
                    <div style="border:1.5px solid #333; margin-bottom: 0;">
                        <table style="width:100%; border-collapse:collapse; margin:0; border:none; font-size:14px; color:#000;">
                            <tr>
                                <td style="width:100px; text-align:center; padding:10px; border-right:1px solid #333; border-bottom:1px solid #333;">
                                    <img src="https://raw.githubusercontent.com/anchasa241138-dotcom/MU10EazyAppversion2026/refs/heads/master/logo_mobi_new.jpg" alt="Logo" style="max-width:80px; height:auto; display:block; margin:0 auto;">
                                </td>
                                <td style="padding:10px 15px; border-right:1px solid #333; border-bottom:1px solid #333; font-weight:bold; line-height:1.5;">
                                    <div>ประเภทเอกสาร : แบบบันทึก</div>
                                    <div>ชื่อเอกสาร : แบบบันทึกตรวจฉลากอาหาร</div>
                                    <div>วันที่เริ่มใช้ :</div>
                                    <div>แผนก : ห้องปฏิบัติการหน่วยเคลื่อนที่เพื่อความปลอดภัยด้านอาหาร เขตสุขภาพที่ 10</div>
                                </td>
                                <td style="width:250px; text-align:right; padding:10px 15px; border-bottom:1px solid #333; font-weight:bold; vertical-align:top; line-height:1.5;">
                                    <div>หมายเลขเอกสาร : MU.10-008</div>
                                    <div>แก้ไขครั้งที่ : 002</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="padding: 10px 15px 15px 15px; font-size:14px; line-height: 1.8;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <div style="flex:1;">หน่วยงานที่เก็บตัวอย่าง: \${sample.collector_agency || '................................................'}</div>
                            <div style="flex:1; text-align:right;">สถานที่เก็บตัวอย่าง: \${sample.sampling_location || '................................................'}</div>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                            <div style="flex:1;">ตำบล: \${sample.sampling_subdistrict || '...................'} อำเภอ: \${sample.sampling_district || '...................'} จังหวัด: \${sample.sampling_province || '...................'}</div>
                            <div style="flex:1; text-align:right;">วันที่เก็บตัวอย่าง: \${samplingDate || '............................................'}</div>
                        </div>
                        
                        <table style="width:100%; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:13px;" border="1">
                            <thead style="text-align:center;">
                                <tr style="background:#f5f5f5; text-align:center; vertical-align:middle; page-break-inside: avoid; font-size:13px;">
                                    <th rowspan="2" style="text-align:center; padding:4px 2px; border:1px solid #555; width:3.5%;">ลำดับ</th>
                                    <th rowspan="2" style="text-align:center; padding:4px 2px; border:1px solid #555; width:12%;">ชื่อผู้จำหน่าย</th>
                                    <th colspan="6" style="text-align:center; padding:4px 2px; border:1px solid #555; width:72.5%;">การตรวจสอบฉลากอาหาร</th>
                                    <th rowspan="2" style="text-align:center; padding:4px 2px; border:1px solid #555; width:12%;">ผลตรวจฉลากอาหาร</th>
                                </tr>
                                <tr style="background:#f5f5f5; text-align:center; vertical-align:middle; font-size:13px;">
                                    <th style="text-align:center; padding:3px 2px; border:1px solid #555; width:12%;">ชื่ออาหาร/ยี่ห้อ</th>
                                    <th style="text-align:center; padding:3px 2px; border:1px solid #555; width:12%;">เลขสาระบบอาหาร</th>
                                    <th style="text-align:center; padding:3px 2px; border:1px solid #555; width:20%;">ชื่อผู้ผลิตและที่ตั้ง/นำเข้า</th>
                                    <th style="text-align:center; padding:3px 2px; border:1px solid #555; width:10.5%;">ส่วนประกอบสำคัญ<br>เป็นร้อยละ (มี/ไม่มี)</th>
                                    <th style="text-align:center; padding:3px 2px; border:1px solid #555; width:10.5%;">วันผลิตหรือ<br>หมดอายุ (มี/ไม่มี)</th>
                                    <th style="text-align:center; padding:3px 2px; border:1px solid #555; width:7.5%;">ปริมาณสุทธิ</th>
                                </tr>
                            </thead>
                            <tbody>\${tableRowsHTML}</tbody>
                        </table>
                        
                        <!-- FOOTER SIGNATURES -->
                        <table style="width: 100%; margin:30px 0 0 0; border-collapse:collapse; font-size:12px; color: #000; line-height:1.6;">
                            <tr>
                                <td style="width:33%; vertical-align:top; text-align:center; padding-right:10px;">
                                    <div>ลงชื่อผู้เก็บตัวอย่าง ....\${sample.collector_name ? '<u>' + sample.collector_name + '</u>' : '................................................'}....</div>
                                    <div style="margin-top:4px;">ตำแหน่ง ....\${sample.collector_position ? '<u>' + sample.collector_position + '</u>' : '................................................'}....</div>
                                    <div style="margin-top:4px;">วันที่เก็บตัวอย่าง ....\${samplingDate ? '<u>' + samplingDate + '</u>' : '............................................'}....</div>
                                </td>
                                <td style="width:33%; vertical-align:top; text-align:center; padding:0 10px;">
                                    <div>ลงชื่อผู้ตรวจวิเคราะห์ ....\${sample.analysis_analyst ? '<u>' + sample.analysis_analyst + '</u>' : '................................................'}.... , ................................................</div>
                                    <div style="margin-top:4px;">ตำแหน่ง ....\${analystPos ? '<u>' + analystPos + '</u>' : '................................................'}....</div>
                                    <div style="margin-top:4px;">วันที่ตรวจวิเคราะห์ ....\${analysisDate ? '<u>' + analysisDate + '</u>' : '............................................'}....</div>
                                </td>
                                <td style="width:33%; vertical-align:top; text-align:center;">
                                    <div>ลงชื่อผู้ทบทวนเอกสาร ................................................</div>
                                    <div style="margin-top:4px;">ตำแหน่ง ผจก.ห้องปฏิบัติการหน่วยเคลื่อนที่ฯ เขตสุขภาพที่ 10</div>
                                    <div style="margin-top:4px;">วันที่ทบทวนเอกสาร ............................................</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>\`;
`;

// Replace PDF view logic
const regexPdfRows = /        \} else if \(sample\.form_type === 'MU\.10-005'\) \{\s*let passCount = 0;\s*let totalCount = 0;/g;
js = js.replace(regexPdfRows, mu1008TableRowsHTML + "        } else if (sample.form_type === 'MU.10-005') {\n            let passCount = 0;\n            let totalCount = 0;");
fs.writeFileSync('app_v83.js', js);
console.log('Inserted MU.10-008 table rows logic for PDF');