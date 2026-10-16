downloadExcel() {
        if(!this.currentExportData || this.currentExportData.length === 0) {
            Swal.fire('ไม่มีข้อมูล', 'ไม่มีข้อมูลสำหรับดาวน์โหลด กรุณาปรับตัวกรอง', 'warning');
            return;
        }

        // Map data to Thai headers
        const formatTime = (isoString) => {
            if (!isoString) return '-';
            try {
                const d = new Date(isoString);
                if (isNaN(d)) return '-';
                return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
            } catch(e) { return '-'; }
        };

        const exportData = this.currentExportData.flatMap(s => {
            const createRowForSample = (s, idx, isFallback, validItemCount) => {
                let sampleName = isFallback ? (s.sample_name || s['sample_name_1'] || '-') : (s['sample_name_'+idx] || '-');
                let weight = isFallback ? (s.weight || s['weight_1'] || '-') : (s['weight_'+idx] || '-');
                let source = isFallback ? (s.source || s['source_1'] || '-') : (s['source_'+idx] || '-');
                
                let currentLabNo = s.lab_no;
                if (currentLabNo && !isNaN(parseInt(currentLabNo, 10))) {
                    let offset = validItemCount !== undefined ? validItemCount : 0;
                    currentLabNo = String(parseInt(currentLabNo, 10) + offset).padStart(4, '0');
                } else if (s.lab_id) {
                    currentLabNo = s.lab_id;
                } else {
                    currentLabNo = '-';
                }
                
                let substances = [];
                let interpretations = [];
                let details = [];
                let summaries = [];

                if (s.form_type === 'MU.10-002') {
                    const dict = {
                        'borax': 'บอแรกซ์',
                        'formalin': 'ฟอร์มาลิน',
                        'bleach': 'ฟอกขาว',
                        'salicylic': 'กันรา (ซาลิซิลิค)',
                        'agonist': 'สารเร่งเนื้อแดง'
                    };
                    ['borax', 'formalin', 'bleach', 'salicylic', 'agonist'].forEach(k => {
                        const sum = s['analysis_summary_'+idx+'_'+k] || (!isFallback ? '' : s['analysis_summary_'+k]);
                        if (sum) {
                            substances.push(dict[k]);
                            interpretations.push(s['analysis_interpretation_'+idx+'_'+k] || (!isFallback ? '' : s['analysis_interpretation_'+k]) || '');
                            details.push(s['analysis_details_'+idx+'_'+k] || (!isFallback ? '' : s['analysis_details_'+k]) || '');
                            summaries.push(sum);
                        }
                    });
                } else if (s.form_type === 'MU.10-001') {
                    const sub = s['analysis_substance_'+idx] || (!isFallback ? '' : s.analysis_substance);
                    if (sub) substances.push(sub);
                    const sum = s['analysis_summary_'+idx] || (!isFallback ? '' : s.analysis_summary);
                    if (sum) {
                        interpretations.push(s['analysis_interpretation_'+idx] || (!isFallback ? '' : s.analysis_interpretation) || '');
                        details.push(s['analysis_details_'+idx] || (!isFallback ? '' : s.analysis_details) || '');
                        summaries.push(sum);
                    }
                } else {
                    const sub = s['analysis_substance_'+idx] || s.analysis_substance;
                    if (sub) substances.push(sub);
                    if (s.analysis_interpretation) interpretations.push(s.analysis_interpretation);
                    if (s.analysis_details) details.push(s.analysis_details);
                    if (s.analysis_summary) summaries.push(s.analysis_summary);
                }

                const subsStr = [...new Set(substances.filter(Boolean))].join(', ') || '-';
                const interpStr = [...new Set(interpretations.filter(Boolean))].join(', ') || '-';
                const detailStr = [...new Set(details.filter(Boolean))].join(', ') || '-';
                
                let itemSummary = '-';
                if (summaries.length > 0) {
                    if (summaries.some(x => x === 'ไม่ผ่าน' || x === 'ไม่ผ่านเกณฑ์มาตรฐาน')) {
                        itemSummary = 'ไม่ผ่าน';
                    } else if (summaries.every(x => x === 'ผ่าน' || x === 'ผ่าน')) {
                        itemSummary = 'ผ่าน';
                    } else {
                        itemSummary = [...new Set(summaries.filter(Boolean))].join(', ');
                    }
                } else if (isFallback && s.analysis_summary) {
                    itemSummary = s.analysis_summary;
                }

                if (s.form_type === 'MU.10-003') {
                    const distributor = isFallback ? (s.distributor || s['distributor_1'] || '-') : (s['distributor_'+idx] || '-');
                    const polar_val = isFallback ? (s.polar_value || s['polar_value_1'] || '-') : (s['polar_value_'+idx] || '-');
                    const oil_type = isFallback ? (s.oil_type || s['oil_type_1'] || '-') : (s['oil_type_'+idx] || '-');
                    const fry_dur = isFallback ? (s.fry_duration || s['fry_duration_1'] || '-') : (s['fry_duration_'+idx] || '-');
                    const rep_type = isFallback ? (s.replacement_type || s['replacement_type_1'] || '-') : (s['replacement_type_'+idx] || '-');
                    const last_rep_date = isFallback ? (s.last_replacement_date || s['last_replacement_date_1'] || '-') : (s['last_replacement_date_'+idx] || '-');
                    const rep_freq = isFallback ? (s.replacement_frequency || s['replacement_frequency_1'] || '-') : (s['replacement_frequency_'+idx] || '-');
                    const rep_reason = isFallback ? (s.replacement_reason || s['replacement_reason_1'] || '-') : (s['replacement_reason_'+idx] || '-');
                    const oil_disp = isFallback ? (s.oil_disposal || s['oil_disposal_1'] || '-') : (s['oil_disposal_'+idx] || '-');
                    
                    let mu10003Summary = '-';
                    const num = parseFloat(polar_val);
                    if (!isNaN(num)) {
                        mu10003Summary = num <= 25 ? 'ผ่าน' : 'ไม่ผ่าน';
                    }

                    return {
                        'รหัสอ้างอิง': s.ref_id || '-',
                        'ประเภทฟอร์ม': s.form_type || '-',
                        'รหัสแลป': currentLabNo,
                        'หน่วยงานที่เก็บ': s.agency || '-',
                        'ประเภทสถานที่เก็บ': s.location_type || '-',
                        'สถานที่เก็บ': s.location_name || '-',
                        'ตำบล': s.sub_district || '-',
                        'อำเภอ': s.district || '-',
                        'จังหวัด': s.province || '-',
                        'ชื่อผู้เก็บตัวอย่าง': s.collector_name || '-',
                        'ตำแหน่งผู้เก็บตัวอย่าง': s.collector_position || '-',
                        'วันที่เก็บ': s.sampling_date || '-',
                        'เวลาที่บันทึกเก็บตัวอย่าง': formatTime(s.created_at),
                        'ชื่อตัวอย่าง': sampleName,
                        'น้ำหนัก': weight,
                        'แหล่งที่มาของตัวอย่าง': source,
                        'วันที่รับตัวอย่าง': s.lab_receive_date || '-',
                        'เวลาที่รับตัวอย่าง': formatTime(s.lab_receive_timestamp),
                        'ชื่อผู้ตรวจวิเคราะห์': s.analysis_analyst || '-',
                        'วันที่ตรวจวิเคราะห์': s.analysis_date || '-',
                        'เวลาที่ตรวจวิเคราะห์': formatTime(s.analysis_timestamp),
                        'ชื่อผู้จำหน่าย': distributor,
                        'ชนิดน้ำมัน': oil_type,
                        'ระยะเวลาที่ใช้ทอด': fry_dur,
                        'ลักษณะการเปลี่ยน': rep_type,
                        'วันที่เปลี่ยนล่าสุด': last_rep_date,
                        'ความถี่ในการเปลี่ยน': rep_freq,
                        'เหตุผลที่เปลี่ยน': rep_reason,
                        'การกำจัดน้ำมัน': oil_disp,
                        'ค่าโพลาร์': polar_val,
                        'สรุปผล': mu10003Summary
                    };
                }

                return {
                    'รหัสอ้างอิง': s.ref_id || '-',
                    'ประเภทฟอร์ม': s.form_type || '-',
                    'รหัสแลป': currentLabNo,
                    'หน่วยงานที่เก็บ': s.agency || '-',
                    'ประเภทสถานที่เก็บ': s.location_type || '-',
                    'สถานที่เก็บ': s.location_name || '-',
                    'ตำบล': s.sub_district || '-',
                    'อำเภอ': s.district || '-',
                    'จังหวัด': s.province || '-',
                    'ชื่อผู้เก็บตัวอย่าง': s.collector_name || '-',
                    'ตำแหน่งผู้เก็บตัวอย่าง': s.collector_position || '-',
                    'วันที่เก็บ': s.sampling_date || '-',
                    'เวลาที่บันทึกเก็บตัวอย่าง': formatTime(s.created_at),
                    'ชื่อตัวอย่าง': sampleName,
                    'น้ำหนัก': weight,
                    'แหล่งที่มาของตัวอย่าง': source,
                    'วันที่รับตัวอย่าง': s.lab_receive_date || '-',
                    'เวลาที่รับตัวอย่าง': formatTime(s.lab_receive_timestamp),
                    'ชื่อผู้ตรวจวิเคราะห์': s.analysis_analyst || '-',
                    'วันที่ตรวจวิเคราะห์': s.analysis_date || '-',
                    'เวลาที่ตรวจวิเคราะห์': formatTime(s.analysis_timestamp),
                    'สารปนเปื้อน': subsStr,
                    'การแปลผล': interpStr,
                    'ผลการตรวจวิเคราะห์': detailStr,
                    'สรุปผล': itemSummary
                };
            };

            let rows = [];
            let hasDynamicSamples = false;
            let i = 1;
            let validItemCount = 0;
            while(s['sample_name_'+i] !== undefined) {
                if (s['sample_name_'+i] && s['item_status_'+i] !== 'rejected') {
                    hasDynamicSamples = true;
                    rows.push(createRowForSample(s, i, false, validItemCount));
                    validItemCount++;
                }
                i++;
            }
            
            if (!hasDynamicSamples) {
                rows.push(createRowForSample(s, 1, true, 0));
            }
            
            return rows;
        });


        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Samples_Data");
        
        