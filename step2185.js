const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

js = js.replace(
    /case 'MU\.10-006':\s*title = 'แบบบันทึกการเก็บตัวอย่างเชื้อโคลิฟอร์มขั้นต้น \(SI-2\)';\s*dynamicHTML = `<p class="input-helper">ไม่มีฟิลด์ข้อมูลเฉพาะสำหรับฟอร์มประเภทนี้<\/p>`;\s*break;/,
    `case 'MU.10-006':
                title = 'แบบบันทึกเก็บตัวอย่างน้ำบริโภคจากตู้น้ำดื่มหยอดเหรียญ';
                dynamicHTML = \`<p class="input-helper">ไม่มีฟิลด์ข้อมูลเฉพาะสำหรับฟอร์มประเภทนี้</p>\`;
                break;`
);

fs.writeFileSync('app_v83.js', js);
console.log('Updated title');