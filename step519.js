const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newSignatureUi = `
                            <div class="signature-options-box" style="margin-top: 15px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: var(--primary-color);">รูปแบบการประทับลายเซ็นในเอกสาร PDF</label>
                                <div style="display: flex; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
                                    <label style="cursor: pointer;"><input type="radio" name="pdfSignMode" value="system" checked onchange="app.toggleSignMode()"> ดึงลายเซ็นจากระบบอัตโนมัติ (E-Signature)</label>
                                    <label style="cursor: pointer;"><input type="radio" name="pdfSignMode" value="draw" onchange="app.toggleSignMode()"> วาดลายเซ็นสด</label>
                                    <label style="cursor: pointer;"><input type="radio" name="pdfSignMode" value="wet" onchange="app.toggleSignMode()"> เว้นช่องว่างเพื่อเซ็นด้วยปากกา (Wet Signature)</label>
                                </div>
                                
                                <div id="drawSignatureContainer" style="display: none; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 15px; background: #ffffff;">
                                    <label style="display: block; margin-bottom: 10px; font-size: 13px; color: #64748b;">วาดลายเซ็นของท่านลงในกรอบด้านล่าง (ระบบจะนำไปแปะแทนลายเซ็นปกติของท่าน)</label>
                                    <canvas id="hybridSignaturePad" width="400" height="150" style="border: 1px solid #e2e8f0; border-radius: 4px; cursor: crosshair; touch-action: none; max-width: 100%;"></canvas>
                                    <div style="margin-top: 8px; text-align: right;">
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="app.clearSignaturePad()"><i class="fa-solid fa-eraser"></i> ล้างลายเซ็น</button>
                                    </div>
                                </div>
                            </div>
`;

// Replace the old drawSignatureContainer
html = html.replace(/<div id="drawSignatureContainer" style="display: none;[^]*?<\/div>\s*<\/div>/, newSignatureUi);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Replaced signature UI');
