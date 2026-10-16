const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

const s = js.indexOf('formTypeChartInstance = new Chart');
const sLabels = js.indexOf('labels:', s);
const eLabels = js.indexOf('],', sLabels);

const newLabels = `labels: [
                'ยาฆ่าแมลง',
                'สารบอแรกซ์',
                'สารฟอร์มาลิน',
                'สารฟอกขาว',
                'สารกันรา',
                'สารเร่งเนื้อแดง',
                'สารโพลาร์',
                'โคลิฟอร์มในอาหาร',
                'โคลิฟอร์มในน้ำ'
            `;

js = js.substring(0, sLabels) + newLabels + js.substring(eLabels);
fs.writeFileSync('charts-dash.js', js);
console.log("Fixed labels");