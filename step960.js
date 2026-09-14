const fs = require('fs');
let js = fs.readFileSync('app_v53.js', 'utf8');

// Fix title
js = js.replace('<h3 style="font-size: 16px; margin: 0;">${reportTitle}</h3>', '<h3 style="font-size: 16px; margin: 0; text-align: center;">${reportTitle}</h3>');

// Fix grid spacing
const oldGrid = `<div class="cert-info-grid" style="margin-top: 15px; font-size: 12px; line-height: 1.6;">
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>สถานที่เก็บตัวอย่าง</strong></div>
                                <div>: \${sample.location_name || '-'} \${sample.amphoe ? 'อำเภอ' + sample.amphoe : ''} \${sample.province ? 'จังหวัด' + sample.province : ''}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>วันที่รับตัวอย่าง</strong></div>
                                <div>: \${receiveDate}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>วันที่ตรวจวิเคราะห์</strong></div>
                                <div>: \${analysisDate}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>จำนวนตัวอย่าง</strong></div>
                                <div>: \${totalItemsCount} ตัวอย่าง ผ่าน \${passItemsCount} ตัวอย่าง ผ่านร้อยละ \${passItemsPercent} ดังนี้</div>
                            </div>
                        </div>`;

const newGrid = `<div class="cert-info-grid" style="margin-top: 15px; font-size: 12px; line-height: 1.8;">
                            <div style="display:flex; margin-bottom: 6px;">
                                <div style="width: 140px;"><strong>สถานที่เก็บตัวอย่าง</strong></div>
                                <div>: \${sample.location_name || '-'} \${sample.amphoe ? 'อำเภอ' + sample.amphoe : ''} \${sample.province ? 'จังหวัด' + sample.province : ''}</div>
                            </div>
                            <div style="display:flex; margin-bottom: 6px;">
                                <div style="width: 140px;"><strong>วันที่รับตัวอย่าง</strong></div>
                                <div>: \${receiveDate}</div>
                            </div>
                            <div style="display:flex; margin-bottom: 6px;">
                                <div style="width: 140px;"><strong>วันที่ตรวจวิเคราะห์</strong></div>
                                <div>: \${analysisDate}</div>
                            </div>
                            <div style="display:flex; margin-bottom: 6px;">
                                <div style="width: 140px;"><strong>จำนวนตัวอย่าง</strong></div>
                                <div>: \${totalItemsCount} ตัวอย่าง ผ่าน \${passItemsCount} ตัวอย่าง ผ่านร้อยละ \${passItemsPercent} ดังนี้</div>
                            </div>
                        </div>`;

js = js.replace(oldGrid, newGrid);

// Fix table header
js = js.replace('<th rowspan="2" style="width: 12%;">ประเภท/<br>ชนิดอาหาร</th>', '<th rowspan="2" style="width: 12%;">ชนิดอาหาร</th>');

fs.writeFileSync('app_v53.js', js, 'utf8');
console.log("Replacements done");
