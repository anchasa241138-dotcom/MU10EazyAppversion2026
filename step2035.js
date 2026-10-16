const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

const oldLabels = `            labels: [
                'ผัก/ผลไม้',
                'สารปนเปื้อน',
                'น้ำมัน Ebro',
                'น้ำมัน Kit',
                'เกลือบริโภค',
                'โคลิฟอร์มในน้ำ',
                'โคลิฟอร์มในอาหาร'
            ],`;

const newLabels = `            labels: [
                'ยาฆ่าแมลง',
                'สารบอแรกซ์',
                'สารฟอร์มาลิน',
                'สารฟอกขาว',
                'สารกันรา',
                'สารเร่งเนื้อแดง',
                'สารโพลาร์',
                'โคลิฟอร์มในอาหาร',
                'โคลิฟอร์มในน้ำ'
            ],`;

js = js.replace(oldLabels, newLabels);

const oldData0 = `data: [0, 0, 0, 0, 0, 0, 0]`;
const newData0 = `data: [0, 0, 0, 0, 0, 0, 0, 0, 0]`;

js = js.replace(oldData0, newData0); // pass data
js = js.replace(oldData0, newData0); // fail data

fs.writeFileSync('charts-dash.js', js);
console.log("Updated formTypeChartInstance labels");