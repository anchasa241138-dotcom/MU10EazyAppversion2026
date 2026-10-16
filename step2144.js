const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Update the title
html = html.replace('<h3>เลือกประเภทแบบบันทึกการเก็บตัวอย่าง (MU.10-001 - MU.10-007)</h3>', '<h3>เลือกประเภทแบบบันทึกการเก็บตัวอย่าง (MU.10-001 - MU.10-008)</h3>');

// 2. Add the button
const buttonToAdd = `
                            <button class="form-select-card" data-form-type="MU.10-008">
                                <div class="form-card-badge">MU.10-008</div>
                                <i class="fa-solid fa-tags form-icon"></i>
                                <span>ตรวจฉลากอาหาร</span>
                            </button>
                        </div>`;

html = html.replace(/<button class="form-select-card" data-form-type="MU\.10-007">[\s\S]*?<\/button>\s*<\/div>/, `<button class="form-select-card" data-form-type="MU.10-007">
                                <div class="form-card-badge">MU.10-007</div>
                                <i class="fa-solid fa-biohazard form-icon"></i>
                                <span>เชื้อโคลิฟอร์มขั้นต้น (SI-2)</span>
                            </button>` + buttonToAdd);

fs.writeFileSync('index.html', html);
console.log('Updated index.html');