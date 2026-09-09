const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old global radio buttons and canvas
html = html.replace(/<div class="form-section-divider" style="margin-top: 20px;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// 2. Add mode selectors and canvases to Analyst 1, Analyst 2, Approver 1
const getReplacement = (roleId, labelText) => `
                                <div class="form-group">
                                    <label>${labelText}</label>
                                    <select id="sel-${roleId}" class="form-control">
                                        <option value="">-- ไม่ระบุ --</option>
                                        ${roleId.includes('analyst') ? `
                                        <option value="anchasa">นางสาวอัญชสา ทองสีงามตา</option>
                                        <option value="surachai">นายสุรชัย รินทอง</option>
                                        ` : `
                                        <option value="thitiporn">นางสาวฐิติพร โสภณ</option>
                                        <option value="nonglak">นางสาวนงลักษณ์ ชมภู</option>
                                        <option value="nattakarn">นางสาวณัฐกานต์ วงษ์ประสงค์</option>
                                        <option value="sujittra">นางสาวสุจิตรา แก้วมณี</option>
                                        `}
                                    </select>
                                    <select id="mode-${roleId}" class="form-control" style="margin-top: 8px; font-size: 0.85em; background-color: #f0fdf4; border-color: #bbf7d0; color: #166534;" onchange="app.toggleSignMode('${roleId}')">
                                        <option value="system">ลายเซ็นอัตโนมัติ (E-Sig)</option>
                                        <option value="draw">✏️ วาดลายเซ็นสด</option>
                                        <option value="wet">🖊️ เว้นช่องว่าง (Wet Sig)</option>
                                    </select>
                                    <div id="draw-container-${roleId}" style="display: none; margin-top: 10px; border: 2px dashed #cbd5e1; background: #fff; padding: 10px; border-radius: 8px;">
                                        <div style="font-size:0.8em; color:#64748b; margin-bottom:5px; text-align:center;">วาดลายเซ็นลงในกรอบด้านล่าง</div>
                                        <canvas id="canvas-${roleId}" style="border: 1px solid #e2e8f0; border-radius: 4px; width: 100%; height: 120px; touch-action: none;"></canvas>
                                        <button type="button" class="btn btn-sm" onclick="app.clearSignaturePad('${roleId}')" style="margin-top:8px; width:100%; background:#f1f5f9; color:#475569; border:1px solid #cbd5e1;">
                                            <i class="fa-solid fa-eraser"></i> ล้างลายเซ็น
                                        </button>
                                    </div>
                                </div>`;

html = html.replace(/<div class="form-group">\s*<label>ผู้ตรวจวิเคราะห์คนที่ 1<\/label>\s*<select id="sel-analyst-1" class="form-control">[\s\S]*?<\/select>\s*<\/div>/, getReplacement('analyst-1', 'ผู้ตรวจวิเคราะห์คนที่ 1'));
html = html.replace(/<div class="form-group">\s*<label>ผู้ตรวจวิเคราะห์คนที่ 2<\/label>\s*<select id="sel-analyst-2" class="form-control">[\s\S]*?<\/select>\s*<\/div>/, getReplacement('analyst-2', 'ผู้ตรวจวิเคราะห์คนที่ 2'));
html = html.replace(/<div class="form-group">\s*<label>ผู้รับรองคนที่ 1<\/label>\s*<select id="sel-approver-1" class="form-control">[\s\S]*?<\/select>\s*<\/div>/, getReplacement('approver-1', 'ผู้รับรองคนที่ 1'));

// Approver 2 remains unchanged but we will ensure it has no mode selector
const approver2HTML = `
                                <div class="form-group">
                                    <label>ผู้รับรองคนที่ 2 (ล็อค E-Signature)</label>
                                    <select id="sel-approver-2" class="form-control">
                                        <option value="">-- ไม่ระบุ --</option>
                                        <option value="mallika">นางมัลลิกา สุพล</option>
                                    </select>
                                </div>`;
html = html.replace(/<div class="form-group">\s*<label>ผู้รับรองคนที่ 2<\/label>\s*<select id="sel-approver-2" class="form-control">[\s\S]*?<\/select>\s*<\/div>/, approver2HTML);

fs.writeFileSync('index.html', html, 'utf8');
console.log('UI updated for individual signature modes');
