const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const targetHtml = `} else if (sample.form_type === 'MU.10-008') {
            let passCount = 0;`;

const newHtml = `} else if (sample.form_type === 'MU.10-006') {
            let tableRowsHTML = '';
            sampleItems.forEach((item, i) => {
                const advice = item.ocpb_advice ? '✓' : '';
                const filter = item.ocpb_filter_date ? '✓' : '';
                const warn = item.ocpb_warning ? '✓' : '';
                const mag = item.claim_magnetic ? '✓' : '';
                const mol = item.claim_molecule ? '✓' : '';
                
                tableRowsHTML += \`
                    <tr style="height: 35px; page-break-inside: avoid; text-align: center;">
                        <td style="padding:2px; border:1px solid #555;">\${i+1}</td>
                        <td style="padding:2px; border:1px solid #555;">\${item.amphoe || ''}</td>
                        <td style="padding:2px; border:1px solid #555;">\${item.location || ''}</td>
                        <td style="padding:2px; border:1px solid #555;">\${item.sample_name || ''}</td>
                        <td style="padding:2px; border:1px solid #555;">\${item.company || ''}</td>
                        <td style="padding:2px; border:1px solid #555;">\${item.system || ''}</td>
                        <td style="padding:2px; border:1px solid #555;">\${advice}</td>
                        <td style="padding:2px; border:1px solid #555;">\${filter}</td>
                        <td style="padding:2px; border:1px solid #555;">\${warn}</td>
                        <td style="padding:2px; border:1px solid #555;">\${mag}</td>
                        <td style="padding:2px; border:1px solid #555;">\${mol}</td>
                        <td style="padding:2px; border:1px solid #555;">\${item.claim_other || ''}</td>
                        <td style="padding:2px; border:1px solid #555;">\${item.remark || ''}</td>
                    </tr>
                \`;
            });
            
            mainTableHTML = \`
                <table style="width:100%; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:12px;" border="1">
                    <thead style="text-align:center; font-weight:bold; background:#f5f5f5;">
                        <tr>
                            <th rowspan="2" style="border:1px solid #555; width:4%;">ลำดับ</th>
                            <th rowspan="2" style="border:1px solid #555; width:10%;">อำเภอ</th>
                            <th rowspan="2" style="border:1px solid #555; width:12%;">สถานที่</th>
                            <th rowspan="2" style="border:1px solid #555; width:12%;">ชื่อตู้/ยี่ห้อ</th>
                            <th rowspan="2" style="border:1px solid #555; width:12%;">ชื่อบริษัท</th>
                            <th rowspan="2" style="border:1px solid #555; width:8%;">ระบบ</th>
                            <th colspan="3" style="border:1px solid #555; width:15%;">ฉลาก สคบ.</th>
                            <th colspan="3" style="border:1px solid #555; width:17%;">การกล่าวอ้าง</th>
                            <th rowspan="2" style="border:1px solid #555; width:10%;">หมายเหตุ</th>
                        </tr>
                        <tr>
                            <th style="border:1px solid #555; width:5%;">ข้อแนะนำ</th>
                            <th style="border:1px solid #555; width:5%;">ว/ด/ป ที่เปลี่ยนไส้กรอง</th>
                            <th style="border:1px solid #555; width:5%;">คำเตือน</th>
                            <th style="border:1px solid #555; width:5.6%;">น้ำแร่พลังแม่เหล็ก</th>
                            <th style="border:1px solid #555; width:5.6%;">น้ำจัดเรียงโมเลกุล</th>
                            <th style="border:1px solid #555; width:5.8%;">อื่นๆ ระบุ</th>
                        </tr>
                    </thead>
                    <tbody>\${tableRowsHTML}</tbody>
                </table>
                
                <div style="margin-top: 8px; font-size: 11px;">
                    <div>หมายเหตุ - การลงข้อมูล ถ้ามีการแสดงข้อความ ให้ใส่เครื่องหมาย ✓ ในช่อง</div>
                    <div style="margin-left: 36px;">- การกล่าวอ้าง หากมีข้อความอื่นให้ระบุในช่องหมายเหตุ</div>
                    <div style="margin-left: 36px;">- ถ้าไม่พบการแสดงข้อความ ให้ใส่เครื่องหมาย - ในช่อง</div>
                </div>
            \`;
        } else if (sample.form_type === 'MU.10-008') {
            let passCount = 0;`;

js = js.replace(targetHtml, newHtml);
fs.writeFileSync('app_v83.js', js);
console.log('Injected MU.10-006 table rendering');