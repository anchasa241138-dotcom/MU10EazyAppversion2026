const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const mu1008MainTableHTML = `        } else if (sample.form_type === 'MU.10-008') {
            mainTableHTML = \`
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
                    <tbody>\${tableRows}
                    </tbody>
                </table>
            \`;
`;

// Locate the `} else if (sample.form_type === 'MU.10-005') {` block that assigns `mainTableHTML = `
// We'll replace it by inserting MU.10-008 before it.
const regexMainTable = /        \} else if \(sample\.form_type === 'MU\.10-005'\) \{\s*mainTableHTML = /;
if (regexMainTable.test(js)) {
    js = js.replace(regexMainTable, mu1008MainTableHTML + "        } else if (sample.form_type === 'MU.10-005') {\n            mainTableHTML = ");
    fs.writeFileSync('app_v83.js', js);
    console.log('Inserted MU.10-008 mainTableHTML for view');
} else {
    console.log('regexMainTable failed');
}