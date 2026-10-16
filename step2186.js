const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const targetStr = `} else {
            div.innerHTML = \`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;`;

const replacement = `} else if (formType === 'MU.10-006') {
            div.innerHTML = \`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <h4 style="color: var(--primary-light); margin: 0; font-size: 16px;"><i class="fa-solid fa-glass-water"></i> รายการน้ำจากตู้หยอดเหรียญ #\${this.globalSampleIndex}</h4>
                    <button type="button" class="btn btn-text remove-sample-btn" style="color: #ef4444; padding: 5px; font-weight: 500;" onclick="app.removeGlobalSample(this)"><i class="fa-solid fa-trash"></i> ลบรายการนี้</button>
                </div>
                <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label>1. อำเภอ *</label>
                        <input type="text" name="amphoe_\${this.globalSampleIndex}" required placeholder="เช่น เมือง">
                    </div>
                    <div class="form-group">
                        <label>2. สถานที่ *</label>
                        <input type="text" name="location_\${this.globalSampleIndex}" required placeholder="เช่น ตลาดสด">
                    </div>
                    <div class="form-group">
                        <label>3. ชื่อตู้/ยี่ห้อ *</label>
                        <input type="text" name="sample_name_\${this.globalSampleIndex}" required placeholder="ระบุยี่ห้อตู้">
                    </div>
                    <div class="form-group">
                        <label>4. ชื่อบริษัท *</label>
                        <input type="text" name="company_\${this.globalSampleIndex}" required placeholder="ระบุชื่อบริษัท">
                    </div>
                    <div class="form-group">
                        <label>5. ระบบ *</label>
                        <input type="text" name="system_\${this.globalSampleIndex}" required placeholder="เช่น RO, UV">
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1; margin-top: 10px;">
                        <label style="margin-bottom: 10px; display: block; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-weight: bold;">ฉลาก สคบ.</label>
                        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                            <label style="display: flex; align-items: center; gap: 5px;"><input type="checkbox" name="ocpb_advice_\${this.globalSampleIndex}"> ข้อแนะนำ</label>
                            <label style="display: flex; align-items: center; gap: 5px;"><input type="checkbox" name="ocpb_filter_date_\${this.globalSampleIndex}"> ว/ด/ป ที่เปลี่ยนไส้กรอง</label>
                            <label style="display: flex; align-items: center; gap: 5px;"><input type="checkbox" name="ocpb_warning_\${this.globalSampleIndex}"> คำเตือน</label>
                        </div>
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1; margin-top: 10px;">
                        <label style="margin-bottom: 10px; display: block; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-weight: bold;">การกล่าวอ้าง</label>
                        <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: center;">
                            <label style="display: flex; align-items: center; gap: 5px;"><input type="checkbox" name="claim_magnetic_\${this.globalSampleIndex}"> น้ำแร่พลังแม่เหล็ก</label>
                            <label style="display: flex; align-items: center; gap: 5px;"><input type="checkbox" name="claim_molecule_\${this.globalSampleIndex}"> น้ำจัดเรียงโมเลกุล</label>
                            <div style="flex: 1; display: flex; align-items: center; gap: 10px; min-width: 250px;">
                                <label style="white-space: nowrap;">อื่นๆ ระบุ</label>
                                <input type="text" name="claim_other_\${this.globalSampleIndex}" placeholder="ระบุคำกล่าวอ้างอื่นๆ" style="flex: 1;">
                            </div>
                        </div>
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1; margin-top: 10px;">
                        <label>หมายเหตุ</label>
                        <input type="text" name="remark_\${this.globalSampleIndex}" placeholder="ระบุหมายเหตุ (ถ้ามี)">
                    </div>
                </div>\`;
        } else {
            div.innerHTML = \`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;`;

js = js.replace(targetStr, replacement);
fs.writeFileSync('app_v83.js', js);
console.log('Injected form fields');