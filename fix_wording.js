const fs = require('fs');
let code = fs.readFileSync('app_v49_23.js', 'utf8');

// Update statuses
code = code.replace(
    /const displayStatus = s.status === 'summarized' \? 'รอลงนามผู้ตรวจ' : \(s.status === 'analyst_signed' \? 'รอผู้รับรองอนุมัติ' : s.analysis_summary\);/,
    "const displayStatus = s.status === 'summarized' ? 'รอผู้ตรวจวิเคราะห์และผู้รับรองลงนาม' : (s.status === 'analyst_signed' ? 'รอผู้รับรองลงนาม' : s.analysis_summary);"
);

// Update button in part 1
code = code.replace(
    /btnApprove\.innerHTML = '<i class="fa-solid fa-pen-nib"><\/i> บันทึกลายมือชื่อผู้ตรวจ';/,
    "btnApprove.innerHTML = '<i class=\"fa-solid fa-pen-nib\"></i> บันทึกลายมือชื่อผู้ตรวจวิเคราะห์';"
);

// Update button in part 2
code = code.replace(
    /btnApprove\.innerHTML = '<i class="fa-solid fa-stamp"><\/i> อนุมัติรายงานและลงนามอิเล็กทรอนิกส์';/g,
    "btnApprove.innerHTML = '<i class=\"fa-solid fa-stamp\"></i> บันทึก';"
);

// Cache buster bump
code = code.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=36');

fs.writeFileSync('app_v49_23.js', code, 'utf8');

let indexCode = fs.readFileSync('index.html', 'utf8');
indexCode = indexCode.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=36');
fs.writeFileSync('index.html', indexCode, 'utf8');

console.log('Fixed button text and statuses');
