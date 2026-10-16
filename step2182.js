const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// Fix document name for MU.10-006
js = js.replace(/} else if \(sample\.form_type === 'MU\.10-005'\) \{\s*documentName = 'แบบบันทึกการสุ่มตัวอย่างเกลือบริโภค';\s*documentNum = 'MU\.10-005';\s*}/,
`} else if (sample.form_type === 'MU.10-005') {
            documentName = 'แบบบันทึกการสุ่มตัวอย่างเกลือบริโภค';
            documentNum = 'MU.10-005';
        } else if (sample.form_type === 'MU.10-006') {
            documentName = 'แบบบันทึกการเก็บตัวอย่างเชื้อโคลิฟอร์มขั้นต้น (SI-2)';
            documentNum = 'MU.10-006';
        }`);

// Replace hardcoded META FIELDS string with dynamic variable
const metaRegex = /<!-- META FIELDS --> <table.*?<\/table> <!-- MAIN TABLE -->/s;
const replacement = `<!-- META FIELDS --> \${
                    sample.form_type === 'MU.10-006' 
                    ? \`<table style="width:100%; margin:0 0 4px 0; border-collapse:collapse; color:#000; font-size:11.5px; font-weight:bold;"> <tr> <td style="width:100%; padding:2px 0;">สถานที่เก็บตัวอย่าง ....<u>\${sample.location_name || ''}</u>....</td> </tr> <tr> <td style="padding:2px 0;">ตำบล ....<u>\${sample.tambon || ''}</u>.... อำเภอ ....<u>\${sample.amphoe || ''}</u>.... จังหวัด ....<u>\${sample.province || ''}</u>.... วันที่เก็บตัวอย่าง ....<u>\${samplingDate}</u>.... </td> </tr> </table>\`
                    : \`<table style="width:100%; margin:0 0 4px 0; border-collapse:collapse; color:#000; font-size:11.5px; font-weight:bold;"> <tr> <td style="width:50%; padding:2px 0;">หน่วยงานที่เก็บตัวอย่าง ....<u>\${sample.agency || ''}</u>....</td> <td style="padding:2px 0;">สถานที่เก็บตัวอย่าง ....<u>\${sample.location_name || ''}</u>....</td> </tr> <tr> <td colspan="2" style="padding:2px 0;">ตำบล ....<u>\${sample.tambon || ''}</u>.... อำเภอ ....<u>\${sample.amphoe || ''}</u>.... จังหวัด ....<u>\${sample.province || ''}</u>.... วันที่เก็บตัวอย่าง ....<u>\${samplingDate}</u>.... </td> </tr> </table>\`
                } <!-- MAIN TABLE -->`;

js = js.replace(metaRegex, replacement);

fs.writeFileSync('app_v83.js', js);
console.log('Fixed MU.10-006 PDF logic');