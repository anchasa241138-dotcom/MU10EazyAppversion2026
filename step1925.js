const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('openCertifyModal(refId, viewOnly = false, forceEdit = false)');
const e = js.indexOf('enableEditApproval()', s);
const content = js.substring(s, e);

const targetStr = `            container.innerHTML = fullHtml;
        }
        if(viewOnly || (sample.status === 'approved' && !forceEdit)) {`;

const newCode = `            container.innerHTML = fullHtml;
        } else if (sample.form_type === 'MU.10-005') {
            if (!sample.sel_analyst_1 || !sample.sel_analyst_2) {
                sample.sel_analyst_1 = sample.sel_analyst_1 || 'anchasa';
                sample.sel_analyst_2 = sample.sel_analyst_2 || 'surachai';
                sample.sel_approver_1 = sample.sel_approver_1 || 'thitiporn';
                sample.sel_approver_2 = sample.sel_approver_2 || 'mallika';
                this.saveSamples();
            }
            
            let passCount = 0;
            let totalCount = 0;
            const sampleItems = [];
            let itemIdx = 1;
            while (sample['sample_name_'+itemIdx] !== undefined) {
                sampleItems.push({
                    food_type: sample['sample_name_'+itemIdx] || '',
                    distributor: sample['distributor_'+itemIdx] || sample.distributor || '',
                    food_serial_no: sample['food_serial_no_'+itemIdx] || '',
                    manufacturer_info: sample['manufacturer_info_'+itemIdx] || '',
                    has_mfg_exp: sample['has_mfg_exp_'+itemIdx] || '',
                    iodate_value: sample['iodate_value_'+itemIdx] || '',
                    test_outcome: sample['test_outcome_'+itemIdx] || ''
                });
                itemIdx++;
            }
            
            let tableRowsHTML = '';
            sampleItems.forEach((item, i) => {
                if (item.food_type) {
                    totalCount++;
                    if (item.test_outcome === 'ผ่าน') passCount++;
                    tableRowsHTML += \`
                        <tr style="height: 40px; page-break-inside: avoid; text-align: center;"> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${i + 1}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.distributor}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.food_type}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.food_serial_no}</td> 
                            <td style="padding:4px; text-align:left; font-size:14px; border:1px solid #555;">\${item.manufacturer_info}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.has_mfg_exp}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.iodate_value}</td> 
                            <td style="padding:4px; font-size:14px; border:1px solid #555;">\${item.test_outcome}</td> 
                        </tr>\`;
                }
            });
            
            const passPct = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(0) : 0;
            const samplingDate = sample.sampling_date ? new Date(sample.sampling_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' }) : '-';
            
            container.innerHTML = \`
              <style>* { font-family: 'TH SarabunPSK', 'SarabunPDF', 'Sarabun', sans-serif !important; letter-spacing: normal !important; }</style> 
              <div class="pdf-document cert-pdf-border" style="width: 780px !important; min-height: 1100px; display: block; position: relative; margin: 0 auto; padding: 25px 30px; box-sizing: border-box; background: white;"> 
                  
                  <!-- HEADER -->
                  <div style="position: relative; height: 100px; margin-bottom: 25px;">
                      <div style="position: absolute; top: 0; right: 0; text-align: right; font-size: 13px;">
                          RD-005<br>หน้าที่ 1/1
                      </div>
                  </div>
                  
                  <!-- TITLE -->
                  <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 15px;">
                      ผลการตรวจวิเคราะห์ปริมาณไอโอดีนในเกลือบริโภค โดยใช้เครื่อง I-Reader
                  </div>
                  
                  <!-- META INFO -->
                  <table style="width: 100%; border: none; font-size: 15px; margin-bottom: 15px; line-height: 1.5;">
                      <tr>
                          <td style="width: 160px; font-weight: bold;">สถานที่เก็บตัวอย่าง</td>
                          <td>: \${sample.location_name || ''} \${sample.amphoe ? 'อำเภอ'+sample.amphoe : ''} \${sample.province ? 'จังหวัด'+sample.province : ''}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">วันที่รับตัวอย่าง</td>
                          <td>: \${samplingDate}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">วันที่ตรวจวิเคราะห์</td>
                          <td>: \${sample.analysis_date ? new Date(sample.analysis_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric'}) : ''}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">จำนวนตัวอย่างทั้งหมด</td>
                          <td>: \${totalCount} ตัวอย่าง ผ่าน \${passCount} ตัวอย่าง ผ่านร้อยละ \${passPct} ดังนี้</td>
                      </tr>
                  </table>
                  
                  <!-- TABLE -->
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;" border="1">
                      <thead>
                          <tr style="background: #f5f5f5; text-align: center; font-weight: bold;">
                              <th style="padding: 6px 2px; width: 5%; border: 1px solid #555;">ลำดับ</th>
                              <th style="padding: 6px 2px; width: 14%; border: 1px solid #555;">ชื่อ</th>
                              <th style="padding: 6px 2px; width: 14%; border: 1px solid #555;">ตัวอย่าง</th>
                              <th style="padding: 6px 2px; width: 15%; border: 1px solid #555;">เลขสารบบอาหาร</th>
                              <th style="padding: 6px 2px; width: 22%; border: 1px solid #555;">ชื่อ/ที่อยู่ ผู้ผลิต หรือ<br>จัดจำหน่าย</th>
                              <th style="padding: 6px 2px; width: 10%; border: 1px solid #555;">วันผลิต/<br>หมดอายุ/ควร<br>บริโภคก่อน</th>
                              <th style="padding: 6px 2px; width: 10%; border: 1px solid #555;">ไอโอดีน<br>(ppm)</th>
                              <th style="padding: 6px 2px; width: 10%; border: 1px solid #555;">สรุปผล</th>
                          </tr>
                      </thead>
                      <tbody>
                          \${tableRowsHTML}
                      </tbody>
                  </table>
                  
                  <!-- NOTE -->
                  <div style="font-size: 11.5px; margin-top: 5px; line-height: 1.3;">
                      <table style="width: 100%; border: none;">
                          <tr>
                              <td style="width: 50px; font-weight: bold; vertical-align: top;">หมายเหตุ</td>
                              <td>-ประกาศกระทรวงสาธารณสุข ลงวันที่ 7 เมษายน 2554 เรื่อง เกลือบริโภคโดยที่เป็นการสมควรปรับปรุงประกาศ กระทรวงสาธารณสุข<br>ว่าด้วยเรื่อง เกลือบริโภค อาศัยอำนาจตามความในมาตรา 5 และมาตรา 6 (3) (4) (6) (7) และ (10) แห่งพระราชบัญญัติอาหาร พ.ศ. 2522<br>รัฐมนตรีว่าการกระทรวงสาธารณสุขออกประกาศไว้ ดังต่อไปนี้ ข้อ 4 เกลือบริโภคต้องมีปริมาณไอโอดีนไม่น้อยกว่า 20 มิลลิกรัม<br>และไม่เกิน 40 มิลลิกรัมต่อเกลือบริโภค 1 กิโลกรัม</td>
                          </tr>
                      </table>
                  </div>
                  
                  <!-- SIGNATURES -->
                  <div class="cert-signatures-grid" style="font-size: 12px; color: #334155; margin-top: 25px; gap: 10px 40px; display: grid; grid-template-columns: 1fr 1fr; text-align: center;">
                      \${renderSignatureSlot(sample.sel_analyst_1, 'ผู้ตรวจวิเคราะห์', 'analyst_1')}
                      \${renderSignatureSlot(sample.sel_analyst_2, 'ผู้ตรวจวิเคราะห์', 'analyst_2')}
                      \${renderSignatureSlot(sample.sel_approver_1, 'ผู้รับรอง', 'approver_1')}
                      \${renderSignatureSlot(sample.sel_approver_2, 'ผู้รับรอง', 'approver_2')}
                  </div>
                  
              </div>\`;
        }
        if(viewOnly || (sample.status === 'approved' && !forceEdit)) {`;

const newJs = js.replace(targetStr, newCode);
if (newJs === js) {
    console.log("Failed to replace!");
} else {
    fs.writeFileSync('app_v83.js', newJs);
    console.log("Successfully injected MU.10-005 into openCertifyModal!");
}