const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

// 1. Remove the misplaced block from renderAnalysisDynamicSection (pos ~ 668989)
const misplacedStart = "} else if (sample.form_type === 'MU.10-006') {";
const firstIdx = js.indexOf(misplacedStart);
console.log('First idx:', firstIdx);

if (firstIdx < 800000) {
    const endTarget = "} else if (sample.form_type === 'MU.10-008') {";
    const firstEnd = js.indexOf(endTarget, firstIdx);
    if (firstEnd !== -1) {
        js = js.substring(0, firstIdx) + js.substring(firstEnd);
        console.log('Removed misplaced block from renderAnalysisDynamicSection');
    }
}

// 2. Now find the REAL MU.10-006 in generateSubmissionPDF
const pdfMu06Start = js.indexOf("} else if (sample.form_type === 'MU.10-006') {");
console.log('Real PDF MU.10-006 idx:', pdfMu06Start);

const pdfMu08Start = js.indexOf("} else if (sample.form_type === 'MU.10-008') {", pdfMu06Start);
console.log('PDF MU.10-08 start idx:', pdfMu08Start);

const mu06Replacement = `} else if (sample.form_type === 'MU.10-006') {
            let tableRowsHTML = '';
            sampleItems.forEach((item, i) => {
                const hasData = item.sample_name || item.location || item.company || item.amphoe;
                const advice = item.ocpb_advice ? '✓' : (hasData ? '-' : '');
                const filter = item.ocpb_filter_date ? '✓' : (hasData ? '-' : '');
                const warn = item.ocpb_warning ? '✓' : (hasData ? '-' : '');
                const mag = item.claim_magnetic ? '✓' : (hasData ? '-' : '');
                const mol = item.claim_molecule ? '✓' : (hasData ? '-' : '');
                
                tableRowsHTML += \`
                    <tr style="height: 32px; page-break-inside: avoid; text-align: center; font-size: 12px;">
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${hasData ? (i + 1) : ''}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${item.amphoe || ''}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:left;">\${item.location || ''}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:left;">\${item.sample_name || ''}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:left;">\${item.company || ''}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${item.system || ''}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${advice}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${filter}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${warn}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${mag}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${mol}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:left;">\${item.claim_other || ''}</td>
                        <td style="padding:2px; border:1px solid #000; text-align:left;">\${item.remark || ''}</td>
                    </tr>
                \`;
            });

            // Ensure 10 rows minimum as shown in the official form
            const currentCount = sampleItems.length;
            for (let r = currentCount; r < 10; r++) {
                tableRowsHTML += \`
                    <tr style="height: 32px; page-break-inside: avoid; text-align: center; font-size: 12px;">
                        <td style="padding:2px; border:1px solid #000; text-align:center;">\${r + 1}</td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                        <td style="border:1px solid #000;"></td>
                    </tr>
                \`;
            }

            htmlContent = \`
                <style>
                    * {
                        font-family: 'TH SarabunPSK', 'SarabunPDF', 'Sarabun', sans-serif !important;
                    }
                    @page { size: A4 landscape; margin: 10mm; }
                    th, td { font-family: 'TH SarabunPSK', 'SarabunPDF', 'Sarabun', sans-serif !important; }
                </style>
                <div class="pdf-document" style="width: 1050px !important; margin: 0 auto; padding: 15px; color: #000; background: #fff;">
                    <!-- HEADER -->
                    <table style="width:100%; margin:0 0 8px 0; border-collapse:collapse; border: 1.5px solid #000;">
                        <tr>
                            <td style="width:80px; padding:6px; text-align:center; border-right:1px solid #000; vertical-align:middle;">
                                <img src="\${logoBase64 ? (logoBase64.startsWith('data:') ? logoBase64 : 'data:image/jpeg;base64,' + logoBase64) : ''}" alt="Logo" style="max-width:70px; height:auto; display:block; margin:0 auto;">
                            </td>
                            <td style="padding:6px 12px; border-right:1px solid #000; vertical-align:middle; line-height:1.5; font-size:13px; font-weight:bold;">
                                <div>ประเภทเอกสาร : แบบบันทึก</div>
                                <div>ชื่อเอกสาร : แบบบันทึกเก็บตัวอย่างน้ำบริโภคจากตู้น้ำดื่มหยอดเหรียญ</div>
                                <div>วันที่เริ่มใช้ : 1 มกราคม พ.ศ. 2566</div>
                                <div>แผนก : ห้องปฏิบัติการหน่วยเคลื่อนที่เพื่อความปลอดภัยด้านอาหาร เขตสุขภาพที่ 10</div>
                            </td>
                            <td style="width:220px; padding:6px 12px; vertical-align:top; text-align:left; line-height:1.5; font-size:13px; font-weight:bold;">
                                <div>หมายเลขเอกสาร : MU.10-006</div>
                                <div style="margin-top:6px;">แก้ไขครั้งที่ : 001</div>
                            </td>
                        </tr>
                    </table>

                    <!-- META INFO LINE -->
                    <div style="font-size:13px; margin: 8px 0 10px 0; line-height: 1.8; display:flex; justify-content:space-between; flex-wrap:wrap;">
                        <div>สถานที่เก็บตัวอย่าง ....<u>\${sample.location_name || '......................................................'}</u>....</div>
                        <div>วันที่เก็บตัวอย่าง ....<u>\${samplingDate || '........................................'}</u>....</div>
                        <div>ตำบล ....<u>\${sample.tambon || '........................'}</u>....</div>
                        <div>อำเภอ ....<u>\${sample.amphoe || '........................'}</u>....</div>
                        <div>จังหวัด ....<u>\${sample.province || '........................'}</u>....</div>
                    </div>

                    <!-- TABLE -->
                    <table style="width:100%; border-collapse:collapse; border:1.5px solid #000; font-size:12px;" border="1">
                        <thead style="text-align:center; font-weight:bold; background:#fff;">
                            <tr style="height: 28px;">
                                <th rowspan="2" style="border:1px solid #000; width:4%;">ลำดับ</th>
                                <th rowspan="2" style="border:1px solid #000; width:9%;">อำเภอ</th>
                                <th rowspan="2" style="border:1px solid #000; width:12%;">สถานที่</th>
                                <th rowspan="2" style="border:1px solid #000; width:11%;">ชื่อตู้/ยี่ห้อ</th>
                                <th rowspan="2" style="border:1px solid #000; width:12%;">ชื่อบริษัท</th>
                                <th rowspan="2" style="border:1px solid #000; width:7%;">ระบบ</th>
                                <th colspan="3" style="border:1px solid #000; width:16%;">ฉลาก สคบ.</th>
                                <th colspan="3" style="border:1px solid #000; width:18%;">การกล่าวอ้าง</th>
                                <th rowspan="2" style="border:1px solid #000; width:11%;">หมายเหตุ</th>
                            </tr>
                            <tr style="height: 28px;">
                                <th style="border:1px solid #000; width:5.3%;">ข้อแนะนำ</th>
                                <th style="border:1px solid #000; width:5.3%; font-size:10.5px;">ว/ด/ป ที่เปลี่ยนไส้กรอง</th>
                                <th style="border:1px solid #000; width:5.4%;">คำเตือน</th>
                                <th style="border:1px solid #000; width:6%; font-size:10.5px;">น้ำแร่พลังแม่เหล็ก</th>
                                <th style="border:1px solid #000; width:6%; font-size:10.5px;">น้ำจัดเรียงโมเลกุล</th>
                                <th style="border:1px solid #000; width:6%;">อื่นๆ ระบุ</th>
                            </tr>
                        </thead>
                        <tbody>\${tableRowsHTML}</tbody>
                    </table>

                    <!-- FOOTER NOTES AND SIGNATURE -->
                    <div style="display:flex; justify-content:space-between; margin-top:14px; font-size:11.5px; line-height:1.6;">
                        <div>
                            <div><strong>หมายเหตุ</strong> - การลงข้อมูล ถ้ามีการแสดงข้อความ ให้ใส่เครื่องหมาย ✓ ในช่อง</div>
                            <div style="margin-left: 45px;">- การกล่าวอ้าง หากมีข้อความอื่นให้ระบุในช่องหมายเหตุ</div>
                            <div style="margin-left: 45px;">- ถ้าไม่พบการแสดงข้อความ ให้ใส่เครื่องหมาย - ในช่อง</div>
                        </div>
                        <div style="text-align:right; min-width:320px; display:flex; flex-direction:column; align-items:flex-end;">
                            <div>ผู้ทบทวนเอกสาร : ................................................(สำหรับผู้ตรวจวิเคราะห์)</div>
                            <div style="margin-top:6px; margin-right: 120px;">วันที่ ............................................</div>
                            <div style="margin-top:12px; width:18px; height:18px; border:1px solid #000;"></div>
                        </div>
                    </div>
                </div>
            \`;
        `;

js = js.substring(0, pdfMu06Start) + mu06Replacement + js.substring(pdfMu08Start);
fs.writeFileSync('app_v84.js', js, 'utf8');
console.log('Successfully replaced REAL MU.10-006 inside generateSubmissionPDF!');