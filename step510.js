const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add 'draw' and 'wet' options to dropdowns
html = html.replace(/<option value="">-- ไม่ระบุ --<\/option>/g, 
`<option value="">-- ไม่ระบุ --</option>
                                        <option value="wet">-- เซ็นด้วยตัวเอง (Wet Signature) --</option>
                                        <option value="draw">-- วาดลายเซ็น (E-Signature) --</option>`);

// Add canvas after form-grid
const canvasHtml = `
                            <div id="drawSignatureContainer" style="display: none; margin-top: 15px; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 15px; background: #f8fafc;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: var(--primary-color);">กรุณาวาดลายเซ็นลงในกรอบด้านล่าง</label>
                                <canvas id="hybridSignaturePad" width="400" height="150" style="background: white; border: 1px solid #e2e8f0; border-radius: 4px; cursor: crosshair; touch-action: none; max-width: 100%;"></canvas>
                                <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 11px; color: #64748b;">ระบบจะนำลายเซ็นนี้ไปแปะในช่องที่ท่านเลือก "วาดลายเซ็น"</span>
                                    <button type="button" class="btn btn-sm btn-secondary" onclick="app.clearSignaturePad()"><i class="fa-solid fa-eraser"></i> ล้างลายเซ็น</button>
                                </div>
                            </div>
`;
html = html.replace(/(<\/div>\s*<\/div>\s*<\/div>\s*<div id="modal-status-text")/, canvasHtml + '\n$1');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html with signature pad');
