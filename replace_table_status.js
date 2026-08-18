const fs = require('fs');
let code = fs.readFileSync('app_v49_23.js', 'utf8');

const regex = /const displayStatus = [\s\S]*?<td>\$\{actionBtn\}<\/td>\s*`;/g;
let replaced = false;

code = code.replace(regex, (match) => {
    replaced = true;
    return `const displayStatus = s.status === 'summarized' ? 'รอผู้ตรวจวิเคราะห์และผู้รับรองลงนาม' : (s.status === 'analyst_signed' ? 'รอผู้รับรองลงนาม' : s.analysis_summary);
      const statusClass = s.status === 'summarized' ? 'status-pending' : (s.status === 'analyst_signed' ? 'status-warning' : (s.analysis_summary.includes('ไม่ผ่าน') ? 'status-rejected' : 'status-approved'));
          
      let underActionStatus = '';
      if (s.status === 'summarized') {
          underActionStatus = '<div style="margin-top:5px; font-size:12px; color:#eab308; font-weight:600;"><i class="fa-solid fa-circle-exclamation"></i> รอผู้ตรวจวิเคราะห์<br>และผู้รับรองลงนาม</div>';
      } else if (s.status === 'analyst_signed') {
          underActionStatus = '<div style="margin-top:5px; font-size:12px; color:#f97316; font-weight:600;"><i class="fa-solid fa-clock"></i> รอผู้รับรองลงนาม</div>';
      }

      const tr = document.createElement('tr');
              tr.innerHTML = \`
                  <td><strong>\${s.lab_no || s.lab_id}</strong></td>
                  <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">\${s.form_type}</span></td>
                  <td>\${s.sample_name}</td>
                  <td><small>\${(s.analysis_details || s.analysis_details_1 || "-").substring(0, 30)}...</small></td>
                  <td><span class="status-badge \${statusClass}">\${displayStatus}</span></td>
                  <td>\${s.analysis_analyst}</td>
                  <td style="text-align:center;">
                      \${actionBtn}
                      \${underActionStatus}
                  </td>
              \`;`;
});

if(replaced) {
    fs.writeFileSync('app_v49_23.js', code, 'utf8');
    console.log('Replaced successfully');
} else {
    console.log('Regex did not match');
}
