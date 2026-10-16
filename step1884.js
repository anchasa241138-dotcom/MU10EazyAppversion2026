const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const targetStr = `            let tableRowsHTML = '';
            for (let i = 0; i < 7; i++) {
                const item = sampleItems[i];`;
                
// Let's check where the `} else {` block starts for htmlContent.
const s = js.indexOf("let htmlContent = '';");
const endS = js.indexOf('const opt = {', s);
const txt = js.substring(s, endS);
const lastElseIndex = txt.lastIndexOf('} else {');

if (lastElseIndex !== -1) {
    const beforeElse = txt.substring(0, lastElseIndex);
    const afterElse = txt.substring(lastElseIndex);
    
    const mu10005Block = `} else if (sample.form_type === 'MU.10-005') {
            let passCount = 0;
            let totalCount = 0;
            
            // Build table rows specifically for MU.10-005 PDF format
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
            const analyst1 = sample.analysis_analyst || '..............................................';
            
            htmlContent = \`
              <style>* { font-family: 'TH SarabunPSK', 'SarabunPDF', 'Sarabun', sans-serif !important; letter-spacing: normal !important; }</style> 
              <div class="pdf-document cert-pdf-border" style="width: 1000px !important; min-height: 990px; display: block; position: relative; margin: 0; padding: 25px 30px; box-sizing: border-box;"> 
                  
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
                  <table style="width: 100%; margin-top: 35px; border: none; font-size: 14px; text-align: center;">
                      <tr>
                          <td style="width: 50%; padding: 10px;">
                              ลงชื่อ..........................................................ผู้ตรวจวิเคราะห์<br>
                              (นางสาวอัญชสา ทองสีงามตา)<br>นักวิชาการสาธารณสุข
                          </td>
                          <td style="width: 50%; padding: 10px;">
                              ลงชื่อ..........................................................ผู้ตรวจวิเคราะห์<br>
                              (นายสุรชัย รินทอง)<br>นักวิชาการสาธารณสุข
                          </td>
                      </tr>
                      <tr>
                          <td style="width: 50%; padding: 10px; padding-top: 25px;">
                              ลงชื่อ..........................................................ผู้รับรอง<br>
                              (นางสาวฐิติพร อินศร)<br>เภสัชกรชำนาญการพิเศษ<br>หัวหน้าห้องปฏิบัติการ
                          </td>
                          <td style="width: 50%; padding: 10px; padding-top: 25px;">
                              ลงชื่อ..........................................................ผู้รับรอง<br>
                              (นางสาวมัลลิกา สุพล)<br>เภสัชกรชำนาญการพิเศษ<br>หัวหน้ากลุ่มงานคุ้มครองผู้บริโภคและเภสัชสาธารณสุข
                          </td>
                      </tr>
                  </table>
                  
              </div>\`;
        `;
        
    const newTxt = beforeElse + mu10005Block + afterElse;
    js = js.replace(txt, newTxt);
    fs.writeFileSync('app_v83.js', js);
    console.log("Injected custom MU.10-005 PDF template successfully.");
} else {
    console.log("Could not find the else block");
}