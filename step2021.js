const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');
const keywords = ['analysisChart', 'สารปนเปื้อน', 'สารบอแรกซ์', 'ผักผลไม้', 'ยาฆ่าแมลง', 'โพลาร์', 'โคลิฟอร์ม', 'testTypeChart', 'byTestType', 'byAnalysis', 'chartAnalysis'];
keywords.forEach(kw => {
    const idx = js.indexOf(kw);
    console.log(`"${kw}" => index: ${idx}`);
    if (idx !== -1) {
        console.log(js.substring(Math.max(0, idx - 100), idx + 100));
        console.log('---');
    }
});