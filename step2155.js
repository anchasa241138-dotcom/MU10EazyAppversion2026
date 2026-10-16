const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

// 1. Add foodLabel to stats
js = js.replace(/        'coliformWater': \{ label: 'เชื้อโคลิฟอร์มในน้ำ', total: 0, pass: 0, fail: 0 \}/, `        'coliformWater': { label: 'เชื้อโคลิฟอร์มในน้ำ', total: 0, pass: 0, fail: 0 },
        'foodLabel': { label: 'ฉลากอาหาร', total: 0, pass: 0, fail: 0 }`);

// 2. Add if (s.form_type === 'MU.10-008') { ... }
js = js.replace(/        \} else if \(s\.form_type === 'MU\.10-006'\) \{\s*inc\('coliformWater', getSingleSummary\(\)\);\s*\}/, `        } else if (s.form_type === 'MU.10-006') {
            inc('coliformWater', getSingleSummary());
        } else if (s.form_type === 'MU.10-008') {
            inc('foodLabel', idx ? s['label_summary_' + idx] : s['label_summary']);
        }`);

fs.writeFileSync('charts-dash.js', js);
console.log('Modified charts-dash.js');