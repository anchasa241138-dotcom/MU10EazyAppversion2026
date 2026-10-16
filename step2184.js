const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update the button text for MU.10-006
html = html.replace(
    /<div class="form-card-badge">MU\.10-006<\/div>[\s\n]*<i class="fa-solid fa-biohazard form-icon"><\/i>[\s\n]*<span>เชื้อโคลิฟอร์มขั้นต้น \(SI-2\)<\/span>/,
    '<div class="form-card-badge">MU.10-006</div>\n                                <i class="fa-solid fa-glass-water form-icon"></i>\n                                <span>ตู้น้ำดื่มหยอดเหรียญ</span>'
);

html = html.replace(
    /<option value="MU\.10-006">.*?<\/option>/,
    '<option value="MU.10-006">MU.10-006 ตู้น้ำดื่มหยอดเหรียญ</option>'
);

fs.writeFileSync('index.html', html);
console.log('Updated index.html');