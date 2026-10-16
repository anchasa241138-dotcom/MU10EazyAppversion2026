const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const newForgot = `
    handleForgotPassword(e) {
        e.preventDefault();
        const username = document.getElementById('forgot-username').value.trim();
        const cid = document.getElementById('forgot-cid').value.trim();

        if (typeof auth !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'ขออภัย',
                text: 'เนื่องจากมีการอัปเกรดความปลอดภัยสูงสุด กรุณาแจ้งผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่านชั่วคราวครับ',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this.switchAuthTab('login');
                e.target.reset();
            });
        } else {
            const newPass = document.getElementById('forgot-new-password').value;
            const confirmPass = document.getElementById('forgot-confirm-password').value;

            if (newPass !== confirmPass) {
                Swal.fire('ข้อผิดพลาด', 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน', 'error');
                return;
            }

            const userIndex = this.users.findIndex(u => u.username === username && u.cid === cid);
            if (userIndex === -1) {
                Swal.fire('ข้อผิดพลาด', 'ข้อมูล Username หรือ เลขบัตรประชาชน (CID) ไม่ถูกต้อง', 'error');
                return;
            }

            this.users[userIndex].password = newPass;
            if(typeof db !== 'undefined') { db.ref('users').set(this.users); }

            Swal.fire({
                icon: 'success',
                title: 'เปลี่ยนรหัสผ่านสำเร็จ',
                text: 'คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที',
                confirmButtonText: 'เข้าสู่ระบบ'
            }).then(() => {
                this.switchAuthTab('login');
                e.target.reset();
            });
        }
    },
`;

js = js.replace(/handleForgotPassword\(e\) \{[\s\S]*?\},/, newForgot);
fs.writeFileSync('app_v83.js', js);
console.log("Updated handleForgotPassword");