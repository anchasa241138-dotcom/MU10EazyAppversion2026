const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.indexOf("แบบบันทึกเก็บตัวอย่างน้ำบริโภคจากตู้น้ำดื่มหยอดเหรียญ");
while (pos !== -1) {
    console.log('Found title at:', pos);
    console.log(js.substring(pos - 100, pos + 200));
    pos = js.indexOf("แบบบันทึกเก็บตัวอย่างน้ำบริโภคจากตู้น้ำดื่มหยอดเหรียญ", pos + 1);
}