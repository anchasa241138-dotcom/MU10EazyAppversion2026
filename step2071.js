const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const newLogout = `
    logout() {
        if (typeof auth !== 'undefined') {
            auth.signOut().then(() => {
                this.currentUser = null;
                sessionStorage.removeItem('sskmoph_session');
                this.updateAuthUI();
                this.showLoginModal();
            });
        } else {
            this.currentUser = null;
            sessionStorage.removeItem('sskmoph_session');
            this.updateAuthUI();
            this.showLoginModal();
        }
    },
`;
js = js.replace(/logout\(\) \{[\s\S]*?\},/, newLogout);

const newLogin = `
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        
        if (typeof auth !== 'undefined') {
            Swal.fire({ title: 'กำลังเข้าสู่ระบบ...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
            auth.signInWithEmailAndPassword(username.toLowerCase() + '@mu10.local', pass)
                .then((userCredential) => {
                    const uid = userCredential.user.uid;
                    return db.ref('users/' + uid).once('value');
                })
                .then((snapshot) => {
                    const user = snapshot.val();
                    if (user) {
                        this.currentUser = user;
                        sessionStorage.setItem('sskmoph_session', JSON.stringify(user));
                        Swal.fire({ icon: 'success', title: 'เข้าสู่ระบบสำเร็จ', text: \`ยินดีต้อนรับ \${user.fullname}\`, timer: 1500, showConfirmButton: false });
                        document.body.classList.remove('require-login-mode');
                        const closeBtn = document.querySelector('#authModal .close-modal-btn');
                        if (closeBtn) closeBtn.style.display = 'block';
                        this.closeAuthModal();
                        this.updateAuthUI();
                        document.getElementById('loginForm').reset();
                    } else {
                        Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูลผู้ใช้ในระบบ', text: 'โปรดติดต่อผู้ดูแลระบบ' });
                        auth.signOut();
                    }
                })
                .catch((error) => {
                    Swal.fire({ icon: 'error', title: 'เข้าสู่ระบบล้มเหลว', text: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' });
                });
        } else {
            const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === pass);
            if (user) {
                this.currentUser = user;
                sessionStorage.setItem('sskmoph_session', JSON.stringify(user));
                Swal.fire({ icon: 'success', title: 'เข้าสู่ระบบสำเร็จ', text: \`ยินดีต้อนรับ \${user.fullname}\`, timer: 1500, showConfirmButton: false });
                document.body.classList.remove('require-login-mode');
                const closeBtn = document.querySelector('#authModal .close-modal-btn');
                if (closeBtn) closeBtn.style.display = 'block';
                this.closeAuthModal();
                this.updateAuthUI();
                e.target.reset();
            } else {
                Swal.fire({ icon: 'error', title: 'เข้าสู่ระบบล้มเหลว', text: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' });
            }
        }
    },
`;
js = js.replace(/handleLogin\(e\) \{[\s\S]*?handleForgotPassword\(e\) \{/, newLogin + '\n    handleForgotPassword(e) {');


const newRegister = `
    handleRegister(e) {
        e.preventDefault();
        
        const title = document.getElementById('reg-title') ? document.getElementById('reg-title').value : '';
        const firstname = document.getElementById('reg-firstname') ? document.getElementById('reg-firstname').value : '';
        const lastname = document.getElementById('reg-lastname') ? document.getElementById('reg-lastname').value : '';
        const username = document.getElementById('reg-username') ? document.getElementById('reg-username').value : '';
        const pass = document.getElementById('reg-password') ? document.getElementById('reg-password').value : '';
        const confirmPass = document.getElementById('reg-confirm-password') ? document.getElementById('reg-confirm-password').value : '';
        const role = document.getElementById('reg-role') ? document.getElementById('reg-role').value : 'collector';
        
        const fullname = \`\${title}\${firstname} \${lastname}\`.trim();

        if (pass !== confirmPass) {
            Swal.fire('ข้อผิดพลาด', 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน', 'error');
            return;
        }

        if (typeof auth !== 'undefined') {
            Swal.fire({ title: 'กำลังลงทะเบียน...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
            const email = username.toLowerCase() + '@mu10.local';
            
            auth.createUserWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                    const uid = userCredential.user.uid;
                    const newUser = {
                        uid: uid,
                        username: username,
                        fullname: fullname,
                        role: role,
                        status: 'pending',
                        createdAt: new Date().toISOString()
                    };
                    
                    return db.ref('users/' + uid).set(newUser);
                })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'ลงทะเบียนสำเร็จ!',
                        text: 'ระบบได้ส่งคำขออนุมัติบัญชีไปยังผู้ดูแลระบบแล้ว กรุณารอการอนุมัติก่อนเข้าใช้งาน',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        this.switchAuthTab('login');
                        e.target.reset();
                        auth.signOut(); // log them out immediately since they are pending
                    });
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        Swal.fire('ข้อผิดพลาด', 'Username นี้มีผู้ใช้งานแล้ว', 'error');
                    } else if (error.code === 'auth/weak-password') {
                        Swal.fire('ข้อผิดพลาด', 'รหัสผ่านอ่อนเกินไป ต้องมีความยาวอย่างน้อย 6 ตัวอักษร', 'error');
                    } else {
                        Swal.fire('ข้อผิดพลาด', error.message, 'error');
                    }
                });
        } else {
            const exists = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (exists) {
                Swal.fire('ข้อผิดพลาด', 'Username นี้มีผู้ใช้งานแล้ว', 'error');
                return;
            }

            const newUser = { username, password: pass, role, fullname, status: 'pending', createdAt: new Date().toISOString() };
            this.users.push(newUser);
            
            Swal.fire({
                icon: 'success',
                title: 'ลงทะเบียนสำเร็จ!',
                text: 'ระบบได้ส่งคำขออนุมัติบัญชีไปยังผู้ดูแลระบบแล้ว กรุณารอการอนุมัติก่อนเข้าใช้งาน',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                this.switchAuthTab('login');
                e.target.reset();
            });
        }
    },
`;

js = js.replace(/handleRegister\(e\) \{[\s\S]*?updateSidebarBadges\(\) \{/, newRegister + '\n    updateSidebarBadges() {');


fs.writeFileSync('app_v83.js', js);
console.log("Updated handleLogin and handleRegister for Firebase Auth");