const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// Replace approveUser logic
const newApprove = `
    approveUser(username) {
        Swal.fire({
            title: 'ยืนยันการอนุมัติ?',
            text: \`คุณต้องการอนุมัติบัญชี \${username} ใช่หรือไม่\`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันอนุมัติ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const user = this.users.find(u => u.username === username);
                if (user) {
                    if (typeof db !== 'undefined' && user.uid) {
                        db.ref('users/' + user.uid).update({ status: 'approved' });
                        Swal.fire('สำเร็จ', 'อนุมัติบัญชีเรียบร้อยแล้ว', 'success');
                    } else {
                        user.status = 'approved';
                        if(typeof db !== 'undefined') { db.ref('users').set(this.users); }
                        Swal.fire('สำเร็จ', 'อนุมัติบัญชีเรียบร้อยแล้ว', 'success');
                        this.renderManageUsers();
                        this.updateBadges();
                    }
                }
            }
        });
    },
`;
js = js.replace(/approveUser\(username\) \{[\s\S]*?\},/, newApprove);

// Replace deleteUser logic
const newDelete = `
    deleteUser(username) {
        Swal.fire({
            title: 'ยืนยันการลบบัญชี?',
            text: \`คุณต้องการลบบัญชี "\${username}" ใช่หรือไม่? ข้อมูลผู้ใช้นี้จะถูกลบออกจากระบบ\`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ลบบัญชี',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const user = this.users.find(u => u.username === username);
                if (user) {
                    if (typeof db !== 'undefined' && user.uid) {
                        db.ref('users/' + user.uid).remove();
                        Swal.fire('ลบสำเร็จ', 'บัญชีผู้ใช้ถูกลบเรียบร้อยแล้ว', 'success');
                    } else {
                        this.users = this.users.filter(u => u.username !== username);
                        if(typeof db !== 'undefined') { db.ref('users').set(this.users); }
                        this.renderManageUsers();
                        this.updateBadges();
                        Swal.fire('ลบสำเร็จ', 'บัญชีผู้ใช้ถูกลบเรียบร้อยแล้ว', 'success');
                    }
                }
            }
        });
    },
`;
js = js.replace(/deleteUser\(username\) \{[\s\S]*?\},/, newDelete);

fs.writeFileSync('app_v83.js', js);
console.log("Fixed approveUser and deleteUser");