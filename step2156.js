const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('สัดส่วนผลการตรวจวิเคราะห์แยกตามรายสาร (9 รายการ)', 'สัดส่วนผลการตรวจวิเคราะห์แยกตามรายสาร (10 รายการ)');

fs.writeFileSync('index.html', html);
console.log('Modified index.html');