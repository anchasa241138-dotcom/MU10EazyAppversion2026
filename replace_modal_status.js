const fs = require('fs');
let code = fs.readFileSync('app_v49_23.js', 'utf8');

const regex = /const btnApprove = document\.getElementById\('btnApproveAndSign'\);/;
let replaced = false;

code = code.replace(regex, (match) => {
    replaced = true;
    return `const btnApprove = document.getElementById('btnApproveAndSign');
              const modalStatusText = document.getElementById('modal-status-text');
              if (modalStatusText) {
                  if (sample.status === 'summarized') {
                      modalStatusText.innerHTML = 'สถานะปัจจุบัน: <span style="color:#eab308; font-weight:600;"><i class="fa-solid fa-circle-exclamation"></i> รอผู้ตรวจวิเคราะห์และผู้รับรองลงนาม</span>';
                  } else if (sample.status === 'analyst_signed') {
                      modalStatusText.innerHTML = 'สถานะปัจจุบัน: <span style="color:#f97316; font-weight:600;"><i class="fa-solid fa-clock"></i> รอผู้รับรองลงนาม</span>';
                  } else if (sample.status === 'approved') {
                      modalStatusText.innerHTML = 'สถานะปัจจุบัน: <span style="color:#10b981; font-weight:600;"><i class="fa-solid fa-check-circle"></i> อนุมัติเสร็จสมบูรณ์</span>';
                  } else {
                      modalStatusText.innerHTML = '';
                  }
              }`;
});

if(replaced) {
    fs.writeFileSync('app_v49_23.js', code, 'utf8');
    console.log('Replaced successfully');
} else {
    console.log('Regex did not match');
}
