const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// I will write a regex to replace the entire MU.10-005 HTML block in BOTH places!
const updatedMu10005Html = `
            let passCount = 0;
            let totalCount = 0;
            const sampleItems = [];
            let itemIdx = 1;
            while (sample['sample_name_'+itemIdx] !== undefined) {
                sampleItems.push({
                    food_type: sample['sample_name_'+itemIdx] || '',
                    distributor: sample['distributor_'+itemIdx] || sample.distributor || '',
                    food_serial_no: sample['food_serial_no_'+itemIdx] || '-',
                    manufacturer_info: sample['manufacturer_info_'+itemIdx] || '-',
                    has_mfg_exp: sample['has_mfg_exp_'+itemIdx] || '-',
                    iodate_value: sample['iodate_value_'+itemIdx] || '-',
                    test_outcome: sample['test_outcome_'+itemIdx] || '-'
                });
                itemIdx++;
            }
            
            let tableRowsHTML = '';
            sampleItems.forEach((item, i) => {
                if (item.food_type) {
                    totalCount++;
                    if (item.test_outcome === 'ผ่าน') passCount++;
                    tableRowsHTML += \`
                        <tr style="page-break-inside: avoid; text-align: center;"> 
                            <td style="padding:2px; font-size:13px; border:1px solid #000;">\${i + 1}</td> 
                            <td style="padding:2px; font-size:13px; border:1px solid #000;">\${item.distributor}</td> 
                            <td style="padding:2px; font-size:13px; border:1px solid #000;">\${item.food_type}</td> 
                            <td style="padding:2px; font-size:13px; border:1px solid #000;">\${item.food_serial_no}</td> 
                            <td style="padding:2px; text-align:center; font-size:13px; border:1px solid #000;">\${item.manufacturer_info}</td> 
                            <td style="padding:2px; font-size:13px; border:1px solid #000;">\${item.has_mfg_exp}</td> 
                            <td style="padding:2px; font-size:13px; border:1px solid #000;">\${item.iodate_value}</td> 
                            <td style="padding:2px; font-size:13px; border:1px solid #000;">\${item.test_outcome}</td> 
                        </tr>\`;
                }
            });
            
            const passPct = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(0) : 0;
            const samplingDate = sample.sampling_date ? new Date(sample.sampling_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' }) : '-';
            const analysisDate = sample.analysis_date ? new Date(sample.analysis_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric'}) : '-';
            const locationTxt = \`\${sample.location_name || ''} \${sample.amphoe ? 'อำเภอ'+sample.amphoe : ''} \${sample.province ? 'จังหวัด'+sample.province : ''}\`;

            const fullHtmlResult = \`
              <style>* { font-family: 'TH SarabunPSK', 'SarabunPDF', 'Sarabun', sans-serif !important; letter-spacing: normal !important; }</style> 
              <style>.cert-pdf-border { background-image: url('\${CERT_BG_BASE64}') !important; background-size: cover; }</style>
              <div class="pdf-document cert-pdf-border" style="width: 780px !important; height: 1103px !important; max-height: 1103px !important; display: block; position: relative; margin: 0 auto; padding: 155px 45px 100px 45px; box-sizing: border-box; background-color: white; color: black; background-size: 100% 100% !important; background-repeat: no-repeat !important;"> 
                  
                  <!-- HEADER -->
                  <div style="position: relative; height: 20px; margin-bottom: 5px;">
                      <div style="position: absolute; top: 0; left: 0; font-size: 13px;">
                          RD-005
                      </div>
                      <div style="position: absolute; top: 0; right: 0; text-align: right; font-size: 13px;">
                          หน้าที่ 1/1
                      </div>
                  </div>
                  
                  <!-- TITLE -->
                  <div style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                      ผลการตรวจวิเคราะห์ปริมาณไอโอดีนในเกลือบริโภค โดยใช้เครื่อง I-Reader
                  </div>
                  
                  <!-- META INFO -->
                  <table style="width: 100%; border: none; font-size: 14px; margin-bottom: 5px; line-height: 1.2;">
                      <tr>
                          <td style="width: 150px; font-weight: bold; padding: 2px 0;">สถานที่เก็บตัวอย่าง</td>
                          <td style="padding: 2px 0;">: <u>\${locationTxt}</u></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold; padding: 2px 0;">วันที่รับตัวอย่าง</td>
                          <td style="padding: 2px 0;">: <u>\${samplingDate}</u></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold; padding: 2px 0;">วันที่ตรวจวิเคราะห์</td>
                          <td style="padding: 2px 0;">: <u>\${analysisDate}</u></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold; padding: 2px 0;">จำนวนตัวอย่างทั้งหมด</td>
                          <td style="padding: 2px 0;">: <u>\${totalCount} ตัวอย่าง ผ่าน \${passCount} ตัวอย่าง ผ่านร้อยละ \${passPct}</u> ดังนี้</td>
                      </tr>
                  </table>
                  
                  <!-- TABLE -->
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #000; margin-top: 5px;">
                      <thead>
                          <tr style="text-align: center; font-weight: bold;">
                              <th style="padding: 4px 2px; width: 4%; border: 1px solid #000;">ลำดับ</th>
                              <th style="padding: 4px 2px; width: 15%; border: 1px solid #000;">ชื่อ</th>
                              <th style="padding: 4px 2px; width: 14%; border: 1px solid #000;">ตัวอย่าง</th>
                              <th style="padding: 4px 2px; width: 15%; border: 1px solid #000;">เลขสารบบอาหาร</th>
                              <th style="padding: 4px 2px; width: 22%; border: 1px solid #000;">ชื่อ/ที่อยู่ ผู้ผลิต หรือ<br>จัดจำหน่าย</th>
                              <th style="padding: 4px 2px; width: 12%; border: 1px solid #000;">วันผลิต/<br>หมดอายุ/ควร<br>บริโภคก่อน</th>
                              <th style="padding: 4px 2px; width: 9%; border: 1px solid #000;">ไอโอดีน<br>(ppm)</th>
                              <th style="padding: 4px 2px; width: 9%; border: 1px solid #000;">สรุปผล</th>
                          </tr>
                      </thead>
                      <tbody>
                          \${tableRowsHTML}
                      </tbody>
                  </table>
                  
                  <!-- NOTE -->
                  <div style="font-size: 12px; margin-top: 5px; line-height: 1.3;">
                      <table style="width: 100%; border: none;">
                          <tr>
                              <td style="width: 50px; font-weight: bold; vertical-align: top;">หมายเหตุ</td>
                              <td>-ประกาศกระทรวงสาธารณสุข ลงวันที่ 7 เมษายน 2554 เรื่อง เกลือบริโภคโดยที่เป็นการสมควรปรับปรุงประกาศ กระทรวงสาธารณสุข<br>ว่าด้วยเรื่อง เกลือบริโภค อาศัยอำนาจตามความในมาตรา 5 และมาตรา 6 (3) (4) (6) (7) และ (10) แห่งพระราชบัญญัติอาหาร พ.ศ. 2522<br>รัฐมนตรีว่าการกระทรวงสาธารณสุขออกประกาศไว้ ดังต่อไปนี้ ข้อ 4 เกลือบริโภคต้องมีปริมาณไอโอดีนไม่น้อยกว่า 20 มิลลิกรัม<br>และไม่เกิน 40 มิลลิกรัมต่อเกลือบริโภค 1 กิโลกรัม</td>
                          </tr>
                      </table>
                  </div>
                  
                  <!-- SIGNATURES -->
                  <div class="cert-signatures-grid" style="font-size: 13px; color: #000; margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center;">
                      \${typeof renderSignatureSlot !== 'undefined' ? renderSignatureSlot(sample.sel_analyst_1, 'ผู้ตรวจวิเคราะห์', 'analyst_1') : \`<div style="margin-bottom:10px;">ลงชื่อ..........................................................ผู้ตรวจวิเคราะห์<br>(นางสาวอัญชสา ทองสีงามตา)<br>นักวิชาการสาธารณสุข</div>\`}
                      \${typeof renderSignatureSlot !== 'undefined' ? renderSignatureSlot(sample.sel_analyst_2, 'ผู้ตรวจวิเคราะห์', 'analyst_2') : \`<div style="margin-bottom:10px;">ลงชื่อ..........................................................ผู้ตรวจวิเคราะห์<br>(นายสุรชัย รินทอง)<br>นักวิชาการสาธารณสุข</div>\`}
                      \${typeof renderSignatureSlot !== 'undefined' ? renderSignatureSlot(sample.sel_approver_1, 'ผู้รับรอง', 'approver_1') : \`<div>ลงชื่อ..........................................................ผู้รับรอง<br>(นางสาวฐิติพร อินศร)<br>เภสัชกรชำนาญการพิเศษ<br>หัวหน้าห้องปฏิบัติการ</div>\`}
                      \${typeof renderSignatureSlot !== 'undefined' ? renderSignatureSlot(sample.sel_approver_2, 'ผู้รับรอง', 'approver_2') : \`<div>ลงชื่อ..........................................................ผู้รับรอง<br>(นางสาวมัลลิกา สุพล)<br>เภสัชกรชำนาญการพิเศษ<br>หัวหน้ากลุ่มงานคุ้มครองผู้บริโภคและเภสัชสาธารณสุข</div>\`}
                  </div>
                  
              </div>\`;
`;

// Update in openCertifyModal
const m1Start = js.indexOf("} else if (sample.form_type === 'MU.10-005') {", js.indexOf('openCertifyModal(refId'));
const m1End = js.indexOf("if(viewOnly || (sample.status === 'approved' && !forceEdit)) {", m1Start);

if (m1Start !== -1 && m1End !== -1) {
    const before = js.substring(0, m1Start);
    const after = js.substring(m1End);
    const newBlock = `} else if (sample.form_type === 'MU.10-005') {
            if (!sample.sel_analyst_1 || !sample.sel_analyst_2) {
                sample.sel_analyst_1 = sample.sel_analyst_1 || 'anchasa';
                sample.sel_analyst_2 = sample.sel_analyst_2 || 'surachai';
                sample.sel_approver_1 = sample.sel_approver_1 || 'thitiporn';
                sample.sel_approver_2 = sample.sel_approver_2 || 'mallika';
                this.saveSamples();
            }
            ${updatedMu10005Html}
            container.innerHTML = fullHtmlResult;
        }
        `;
    js = before + newBlock + after;
    console.log("Updated openCertifyModal!");
}

// Update in generateCertificatePDF
const m2Start = js.indexOf("} else if (sample.form_type === 'MU.10-005') {", js.indexOf('generateCertificatePDF'));
const m2End = js.indexOf("} else {", m2Start);

if (m2Start !== -1 && m2End !== -1) {
    const before = js.substring(0, m2Start);
    const after = js.substring(m2End);
    const newBlock = `} else if (sample.form_type === 'MU.10-005') {
            ${updatedMu10005Html}
            htmlContent = fullHtmlResult;
        `;
    js = before + newBlock + after;
    console.log("Updated generateCertificatePDF!");
}

fs.writeFileSync('app_v83.js', js);