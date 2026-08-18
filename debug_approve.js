const fs = require('fs');
let code = fs.readFileSync('app_v49_23.js', 'utf8');

const regex = /    handleApproveReport\(e\) \{\s*const refId = e\.currentTarget\.dataset\.refId;[\s\S]*?            \}\);\s*\},\s*\/\/ PDF Generation/;

const newCode = `    handleApproveReport(e) {
        try {
            const refId = e.currentTarget.dataset.refId || document.getElementById('btnApproveAndSign').dataset.refId;
            const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
            if (sampleIndex === -1) {
                alert("Error: sampleIndex is -1 for refId: " + refId);
                return;
            }
            const sample = this.samples[sampleIndex];

            if (sample.form_type === 'MU.10-001') {
                if (sample.status === 'summarized') {
                    sample.sel_analyst_1 = document.getElementById('sel-analyst-1').value;
                    sample.sel_analyst_2 = document.getElementById('sel-analyst-2').value;
                    sample.status = 'analyst_signed';
                    this.saveSamples();
                    Swal.fire({
                        icon: 'success',
                        title: 'บันทึกลายมือชื่อผู้ตรวจสำเร็จ',
                        text: 'ส่งต่อไปยังผู้รับรองแล้ว',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    this.closeCertifyModal();
                    this.renderCertifyTable();
                    return;
                } else if (sample.status === 'analyst_signed') {
                    sample.sel_approver_1 = document.getElementById('sel-approver-1').value;
                    sample.sel_approver_2 = document.getElementById('sel-approver-2').value;
                    sample.approver_name = "MU.10-001 System"; // placeholder
                    sample.status = 'approved';
                }
            } else {
                const approverName = document.getElementById('approve-officer-name').value;
                if(!approverName) return;
                sample.approver_name = approverName;
                sample.status = 'approved';
            }

            this.saveSamples();
            
            Swal.fire({
                icon: 'success',
                title: 'ลงนามรับรองอิเล็กทรอนิกส์สำเร็จ',
                text: 'สามารถดาวน์โหลดเอกสาร PDF ได้ทันที',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                this.openCertifyModal(refId, true); // Re-open in view mode
                this.renderCertifyTable();
            });
        } catch (err) {
            alert("Error in handleApproveReport: " + err.message + "\\n" + err.stack);
        }
    },

    // PDF Generation`;

code = code.replace(regex, newCode);
code = code.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=37');

fs.writeFileSync('app_v49_23.js', code, 'utf8');

let indexCode = fs.readFileSync('index.html', 'utf8');
indexCode = indexCode.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=37');
fs.writeFileSync('index.html', indexCode, 'utf8');
console.log('Added try-catch and inline onclick');
