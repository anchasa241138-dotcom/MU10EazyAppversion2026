const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const mu1008HTML = `        } else if (formType === 'MU.10-008') {
            div.innerHTML = \`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <h4 style="color: var(--primary-light); margin: 0; font-size: 16px;"><i class="fa-solid fa-tags"></i> รายการตรวจฉลากอาหาร #\${this.globalSampleIndex}</h4>
                    <button type="button" class="btn btn-text remove-sample-btn" style="color: #ef4444; padding: 5px; font-weight: 500;" onclick="app.removeGlobalSample(this)"><i class="fa-solid fa-trash"></i> ลบรายการนี้</button>
                </div>
                <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label>1. ชื่อผู้จำหน่าย *</label>
                        <input type="text" name="distributor_\${this.globalSampleIndex}" required placeholder="ระบุชื่อร้านค้า/ผู้จำหน่าย">
                    </div>
                    <div class="form-group">
                        <label>2. ชื่ออาหาร/ยี่ห้อ *</label>
                        <input type="text" name="sample_name_\${this.globalSampleIndex}" required placeholder="ระบุชื่อยี่ห้ออาหาร">
                    </div>
                    <div class="form-group">
                        <label>3. เลขสาระบบอาหาร *</label>
                        <input type="text" name="food_serial_no_\${this.globalSampleIndex}" required placeholder="เช่น 10-1-01234-5-6789">
                    </div>
                    <div class="form-group">
                        <label>4. ชื่อผู้ผลิตและที่ตั้ง/นำเข้า *</label>
                        <input type="text" name="manufacturer_info_\${this.globalSampleIndex}" required placeholder="ระบุชื่อผู้ผลิตและที่อยู่">
                    </div>
                    <div class="form-group">
                        <label>5. ส่วนประกอบสำคัญ เป็นร้อยละ *</label>
                        <select name="has_ingredient_pct_\${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือก --</option>
                            <option value="มี">มี</option>
                            <option value="ไม่มี">ไม่มี</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>6. วันผลิตหรือหมดอายุ *</label>
                        <select name="has_mfg_exp_\${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือก --</option>
                            <option value="มี">มี</option>
                            <option value="ไม่มี">ไม่มี</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>7. ปริมาณสุทธิ *</label>
                        <input type="text" name="net_weight_\${this.globalSampleIndex}" required placeholder="เช่น 500 กรัม">
                    </div>
                    <div class="form-group">
                        <label>8. ผลตรวจฉลากอาหาร *</label>
                        <select name="label_summary_\${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือก --</option>
                            <option value="ผ่าน">ผ่าน</option>
                            <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                        </select>
                    </div>
                </div>
            \`;\n`;

// Find the line where } else if (formType === 'MU.10-002') { starts, and inject it above it.
js = js.replace(/        \} else if \(formType === 'MU\.10-002'\) \{/, mu1008HTML + "        } else if (formType === 'MU.10-002') {");

fs.writeFileSync('app_v83.js', js);
console.log('Inserted MU.10-008 form HTML logic');