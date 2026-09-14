        } else if (sample.form_type === 'MU.10-003') {
            const receiveDate = new Date(sample.lab_receive_date || sample.created_at).toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'});
            const analysisDate = sample.analysis_date ? new Date(sample.analysis_date).toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'}) : '-';
            const reportTitle = 'ผลการตรวจวัดค่าโพลาร์ในน้ำมันทอดซ้ำ โดยใช้เครื่อง testo 270';
            
            const validItems = [];
            let idx = 1;
            while (sample['polar_value_' + idx] !== undefined) {
                if (sample['polar_value_' + idx] && sample['item_status_' + idx] !== 'rejected') {
                    validItems.push({
                        idx: idx,
                        labId: sample.lab_no ? String(parseInt(sample.lab_no, 10) + validItems.length).padStart(4, '0') : (sample.lab_id ? sample.lab_id + '-' + idx : '-'),
                        distributor: sample['distributor_' + idx] || '-',
                        food_type: sample['sample_name_' + idx] || '-',
                        polar_value: sample['polar_value_' + idx] || '',
                        oil_type: sample['oil_type_' + idx] || '-',
                        fry_duration: sample['fry_duration_' + idx] || '',
                        replacement_type: sample['replacement_type_' + idx] || '-',
                        replacement_frequency: sample['replacement_frequency_' + idx] || ''
                    });
                }
                idx++;
            }
            
            if (validItems.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:20px;">ไม่มีข้อมูลตัวอย่างที่รับเข้าระบบ</div>';
                return;
            }

            let passCount = 0;
            validItems.forEach(item => {
                const num = parseFloat(item.polar_value);
                if (!isNaN(num) && num <= 25) {
                    passCount++;
                }
            });
            const totalItemsCount = validItems.length;
            const passItemsCount = passCount;
            const passItemsPercent = totalItemsCount > 0 ? ((passCount / totalItemsCount) * 100).toFixed(2) : '0.00';

            const ITEMS_PER_PAGE = 10;
            const totalPages = Math.ceil(validItems.length / ITEMS_PER_PAGE);
            let fullHtml = '';
            
            const getCheckMark = (val) => {
                const num = parseFloat(val);
                if(isNaN(num)) return { text: '-' };
                if(num <= 25) return { text: 'ผ่าน' };
                return { text: 'ไม่ผ่าน' };
            };

            for (let page = 0; page < totalPages; page++) {
                const isLastPage = (page === totalPages - 1);
                const pageItems = validItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
                
                let rowsHtml = '';
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    const item = pageItems[i];
                    if (item) {
                        const marks = getCheckMark(item.polar_value);
                        rowsHtml += `
                            <tr>
                                <td style="text-align: center;">${page * ITEMS_PER_PAGE + i + 1}</td>
                                <td>${item.distributor}</td>
                                <td style="text-align: center;">${item.food_type}</td>
                                <td style="text-align: center;">${item.oil_type}</td>
                                <td style="text-align: center;">${item.fry_duration ? item.fry_duration + ' นาที/ครั้ง' : '-'}</td>
                                <td style="text-align: center;">${item.replacement_type}</td>
                                <td style="text-align: center;">${item.replacement_frequency ? item.replacement_frequency + ' วัน/ครั้ง' : '-'}</td>
                                <td style="text-align: center;">${item.polar_value ? item.polar_value + '%' : '-'}</td>
                                <td style="text-align: center;">${marks.text}</td>
                            </tr>
                        `;
                    } else {
                        rowsHtml += `
                            <tr>
                                <td style="text-align: center; color: transparent;">-</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        `;
                    }
                }

                const pageHtml = `
                    <div class="cert-pdf-page">
                        <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:10px; font-weight:bold;">
                            <div>RD-003</div>
                            <div>หน้า ${page + 1}/${totalPages}</div>
                        </div>
                        <div class="cert-header" style="margin-top: 5px;">
                            <h3 style="font-size: 16px; margin: 0;">${reportTitle}</h3>
                        </div>
                        
                        <div class="cert-info-grid" style="margin-top: 15px; font-size: 12px; line-height: 1.6;">
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>สถานที่เก็บตัวอย่าง</strong></div>
                                <div>: ${sample.location_name || '-'} ${sample.amphoe ? 'อำเภอ' + sample.amphoe : ''} ${sample.province ? 'จังหวัด' + sample.province : ''}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>วันที่รับตัวอย่าง</strong></div>
                                <div>: ${receiveDate}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>วันที่ตรวจวิเคราะห์</strong></div>
                                <div>: ${analysisDate}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="width: 140px;"><strong>จำนวนตัวอย่าง</strong></div>
                                <div>: ${totalItemsCount} ตัวอย่าง ผ่าน ${passItemsCount} ตัวอย่าง ผ่านร้อยละ ${passItemsPercent} ดังนี้</div>
                            </div>
                        </div>
                        
                        <table class="cert-multi-table" style="font-size: 9px; margin-top:10px;">
                            <thead>
                                <tr>
                                    <th rowspan="2" style="white-space: nowrap; width: 5%;">ลำดับ</th>
                                    <th rowspan="2" style="width: 15%;">ชื่อผู้จำหน่าย</th>
                                    <th rowspan="2" style="width: 12%;">ประเภท/<br>ชนิดอาหาร</th>
                                    <th colspan="4">น้ำมันที่ทอดอาหาร</th>
                                    <th rowspan="2" style="white-space: nowrap; width: 8%;">ค่าโพลาร์</th>
                                    <th rowspan="2" style="white-space: nowrap; width: 8%;">สรุปผล</th>
                                </tr>
                                <tr>
                                    <th style="width: 10%;">ชนิด<br>น้ำมัน</th>
                                    <th style="width: 10%;">ระยะเวลาที่<br>ใช้ทอด</th>
                                    <th style="width: 10%;">ลักษณะการ<br>เปลี่ยน</th>
                                    <th style="width: 10%;">ความถี่ใน<br>การเปลี่ยน</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                        
                        <div style="margin-top:10px; font-size:10px; margin-bottom: 10px; color: #334155;">
                            <div style="display:flex;">
                                <div style="width:45px;"><strong>หมายเหตุ</strong></div>
                                <div>- การตรวจวัดค่าโพลาร์ในน้ำมันทอดซ้ำ เกณฑ์ผ่านมาตรฐานสารโพลาร์ในน้ำมันทอดซ้ำ คือ ไม่เกิน 25%<br>
                                - น้ำมันทอดซ้ำที่มีค่าโพลาร์มากกว่า 25% เป็นน้ำมันเสื่อมสภาพแล้วไม่ควรใช้</div>
                            </div>
                        </div>
                        
                        <div class="cert-signatures-grid" style="font-size: 12px; color: #334155; margin-top: 5px; gap: 10px 40px;">
                            ${renderSignatureSlot(sample.sel_analyst_1, 'ผู้ตรวจวิเคราะห์', 'analyst_1')}
                            ${renderSignatureSlot(sample.sel_analyst_2, 'ผู้ตรวจวิเคราะห์', 'analyst_2')}
                            ${renderSignatureSlot(sample.sel_approver_1, 'ผู้รับรอง', 'approver_1')}
                            ${renderSignatureSlot(sample.sel_approver_2, 'ผู้รับรอง', 'approver_2')}
                        </div>
                    </div>
                `;
                fullHtml += pageHtml;
            }
            container.innerHTML = fullHtml;
        }