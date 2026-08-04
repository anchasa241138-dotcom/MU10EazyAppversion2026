/**
 * SSKMOPH Main Application Logic
 * Handles Routing, State, Auth, Forms, and PDF/Excel Generation
 */

// Fallback for SweetAlert2 (Swal) if blocked by firewall/offline
if (typeof Swal === 'undefined') {
    window.Swal = {
        fire: function(options) {
            let msg = '';
            if (typeof options === 'string') {
                msg = options;
            } else {
                msg = (options.title ? options.title + '\n' : '') + (options.text || options.html || '');
            }
            const cleanMsg = msg.replace(/<[^>]*>/g, '');
            alert(cleanMsg);
            return Promise.resolve({ isConfirmed: true });
        }
    };
}

// Fallback for SweetAlert2 (Swal) if blocked by firewall/offline
if (typeof Swal === 'undefined') {
    window.Swal = {
        fire: function(options) {
            let msg = '';
            if (typeof options === 'string') {
                msg = options;
            } else {
                msg = (options.title ? options.title + '\n' : '') + (options.text || options.html || '');
            }
            const cleanMsg = msg.replace(/<[^>]*>/g, '');
            alert(cleanMsg);
            return Promise.resolve({ isConfirmed: true });
        }
    };
}

const app = {
    // Current authenticated user (null if not logged in)
    currentUser: null,
    
    // Application Data (mocked in localStorage)
    users: [],
    samples: [],
    unreadRecordsCount: 0,

    // Initialization
    init() {
        try {
            this.initData();
            this.unreadRecordsCount = parseInt(localStorage.getItem('unread_records_count') || '0', 10);
            this.setupEventListeners();
            this.updateAuthUI();
            this.updateSidebarBadges();
            this.switchView('dashboard');
            
            // Start system clock
            setInterval(() => {
                const now = new Date();
                const clockEl = document.getElementById('systemTime');
                if (clockEl) {
                    clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${now.toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.`;
                }
            }, 1000);
        } catch (error) {
            console.error("System initialization failed:", error);
            alert("เกิดข้อผิดพลาดในการเริ่มต้นระบบ (System Init Failed):\n" + error.message + "\n\nStack:\n" + error.stack);
        }
    },

    // Initialize mock database in localStorage
    initData() {
        // Init Users
        try {
            let storedUsers = localStorage.getItem('sskmoph_users');
            if (!storedUsers) {
                this.users = [
                    { username: 'admin', password: 'password', role: 'lab', fullname: 'ดร. สมภพ รักชาติ' },
                    { username: 'lab', password: 'password', role: 'lab', fullname: 'นสพ.วิทยา รักดี' },
                    { username: 'user', password: 'password', role: 'collector', fullname: 'นายสมคิด สุขใจ' }
                ];
                localStorage.setItem('sskmoph_users', JSON.stringify(this.users));
            } else {
                this.users = JSON.parse(storedUsers);
            }
        } catch (e) {
            console.warn("Failed to parse users, resetting default users.", e);
            this.users = [
                { username: 'admin', password: 'password', role: 'lab', fullname: 'ดร. สมภพ รักชาติ' },
                { username: 'lab', password: 'password', role: 'lab', fullname: 'นสพ.วิทยา รักดี' },
                { username: 'user', password: 'password', role: 'collector', fullname: 'นายสมคิด สุขใจ' }
            ];
            localStorage.setItem('sskmoph_users', JSON.stringify(this.users));
        }

        // Init Samples
        try {
            let storedSamples = localStorage.getItem('sskmoph_samples');
            if (!storedSamples) {
                this.resetDefaultSamples();
            } else {
                this.samples = JSON.parse(storedSamples);
                if (!Array.isArray(this.samples)) {
                    throw new Error("Stored samples is not an array");
                }
            }
        } catch (e) {
            console.warn("Failed to parse samples, resetting default samples.", e);
            this.resetDefaultSamples();
        }
        
        // Restore session
        try {
            const session = sessionStorage.getItem('sskmoph_session');
            if (session) {
                this.currentUser = JSON.parse(session);
            }
        } catch (e) {
            console.warn("Failed to parse session", e);
            this.currentUser = null;
        }
    },

    resetDefaultSamples() {
        this.samples = [
            {
                ref_id: 'TEMP-10001', lab_id: 'SSK-2026-0001', form_type: 'MU.10-001',
                agency: 'สสจ.ศรีสะเกษ', location_type: 'ตลาดสด', location_name: 'ตลาดสดเทศบาล',
                province: 'ศรีสะเกษ', amphoe: 'เมือง', tambon: 'เมืองเหนือ',
                collector_name: 'นายสมคิด สุขใจ', sampling_date: '2026-06-20',
                sample_name: 'ผักคะน้า', sample_qty: 1, distributor: 'แผงผัก ป้าแดง', source: 'ตลาดไท',
                status: 'approved', analysis_analyst: 'นสพ.วิทยา รักดี', analysis_date: '2026-06-21',
                analysis_details: 'ไม่พบการตกค้างของยาฆ่าแมลงกลุ่มออร์กาโนฟอสเฟต',
                analysis_summary: 'ผ่านเกณฑ์มาตรฐาน', approver_name: 'ดร. สมภพ รักชาติ',
                created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            },
            {
                ref_id: 'TEMP-10002', lab_id: 'UBN-2026-0002', form_type: 'MU.10-002',
                agency: 'รพ.อุบลราชธานี', location_type: 'ร้านอาหาร', location_name: 'ร้านข้าวมันไก่เฮียชัย',
                province: 'อุบลราชธานี', amphoe: 'เมือง', tambon: 'ในเมือง',
                collector_name: 'นางสาวสุดสวย ใจดี', sampling_date: '2026-06-21',
                sample_name: 'ลูกชิ้นหมู', sample_qty: 2, distributor: 'เฮียชัย', source: 'ผลิตเอง',
                status: 'approved', analysis_analyst: 'นสพ.วิทยา รักดี', analysis_date: '2026-06-22',
                analysis_details: 'ตรวจพบสารบอแรกซ์ 0.5 ppm',
                analysis_summary: 'ไม่ผ่านเกณฑ์มาตรฐาน', approver_name: 'ดร. สมภพ รักชาติ',
                created_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
                ref_id: 'TEMP-10003', lab_id: '', form_type: 'MU.10-006',
                agency: 'สสอ.เมือง', location_type: 'โรงงานผลิต', location_name: 'โรงงานน้ำดื่มตราสิงห์',
                province: 'ยโสธร', amphoe: 'เมือง', tambon: 'ในเมือง',
                collector_name: 'นายมานะ อดทน', sampling_date: '2026-06-22',
                sample_name: 'น้ำดื่มบรรจุขวด', sample_qty: 5, distributor: 'โรงงานน้ำดื่ม', source: 'ผลิตเอง',
                status: 'registered', created_at: new Date().toISOString()
            },
             {
                ref_id: 'TEMP-10004', lab_id: 'AMN-2026-0004', form_type: 'MU.10-003',
                agency: 'สสจ.อำนาจเจริญ', location_type: 'ตลาดนัด', location_name: 'ตลาดนัดวันศุกร์',
                province: 'อำนาจเจริญ', amphoe: 'เมือง', tambon: 'บุ่ง',
                collector_name: 'นางสมศรี ใจสู้', sampling_date: '2026-06-21',
                sample_name: 'น้ำมันทอดไก่', sample_qty: 1, distributor: 'ร้านไก่ทอดป้าแจ๋ว', source: 'ซื้อจากห้าง',
                status: 'accepted', created_at: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        this.saveSamples();
    },

    saveSamples() {
        localStorage.setItem('sskmoph_samples', JSON.stringify(this.samples));
        if (window.updateDashboardCharts) {
            updateDashboardCharts(this.samples);
        }
        this.updateSidebarBadges();
    },

    updateSidebarBadges() {
        // 1. บันทึกการเก็บตัวอย่าง (Red badge for new uploads)
        const recordBadge = document.getElementById('record-notification-badge');
        if (recordBadge) {
            if (this.unreadRecordsCount > 0) {
                recordBadge.innerText = this.unreadRecordsCount;
                recordBadge.classList.remove('hidden');
            } else {
                recordBadge.classList.add('hidden');
            }
        }

        // 2. ตรวจสอบตัวอย่าง (แลป) (Orange badge for status = 'registered')
        const verifyBadge = document.getElementById('verify-notification-badge');
        if (verifyBadge) {
            const count = this.samples.filter(s => s.status === 'registered').length;
            if (count > 0) {
                verifyBadge.innerText = count;
                verifyBadge.classList.remove('hidden');
            } else {
                verifyBadge.classList.add('hidden');
            }
        }

        // 3. ตรวจวิเคราะห์ตัวอย่าง (Blue badge for status = 'accepted')
        const analysisBadge = document.getElementById('analysis-notification-badge');
        if (analysisBadge) {
            const count = this.samples.filter(s => s.status === 'accepted').length;
            if (count > 0) {
                analysisBadge.innerText = count;
                analysisBadge.classList.remove('hidden');
            } else {
                analysisBadge.classList.add('hidden');
            }
        }

        // 4. รับรองผลตรวจวิเคราะห์ (Purple badge for status = 'summarized')
        const certifyBadge = document.getElementById('certify-notification-badge');
        if (certifyBadge) {
            const count = this.samples.filter(s => s.status === 'summarized').length;
            if (count > 0) {
                certifyBadge.innerText = count;
                certifyBadge.classList.remove('hidden');
            } else {
                certifyBadge.classList.add('hidden');
            }
        }
    },

    // Set up all DOM event listeners
    setupEventListeners() {
        // Sidebar routing
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.getAttribute('data-view');
                this.switchView(view);
                
                // On mobile, close sidebar after clicking
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            });
        });

        // Mobile sidebar toggle
        document.getElementById('openSidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('active');
        });
        document.getElementById('closeSidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });

        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));

        // Forms selection
        document.querySelectorAll('.form-select-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const formType = e.currentTarget.getAttribute('data-form-type');
                this.openFormEditor(formType);
            });
        });

        document.getElementById('backToFormSelection').addEventListener('click', () => {
            document.getElementById('formEditorContainer').classList.add('hidden');
            document.querySelector('.form-selection-grid').classList.remove('hidden');
            document.querySelector('.section-title-wrapper').classList.remove('hidden');
            
            const recordsWrapper = document.getElementById('savedRecordsContainerWrapper');
            if (recordsWrapper) recordsWrapper.classList.add('hidden');

            document.getElementById('sampleSubmissionForm').reset();
            document.getElementById('btnExportSubmissionPDF').disabled = true;

            const submitBtn = document.querySelector('#sampleSubmissionForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึกข้อมูลเข้าระบบ';
                submitBtn.className = 'btn btn-success';
            }
            this.currentEditingRefId = null;
        });

        // Submit form
        document.getElementById('sampleSubmissionForm').addEventListener('submit', this.handleFormSubmit.bind(this));
        document.getElementById('btnExportSubmissionPDF').addEventListener('click', this.generateSubmissionPDF.bind(this));

        // Search saved records
        const searchInput = document.getElementById('searchSavedRecords');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.renderSavedRecords();
            });
        }

        // Add Global Sample button
        const addGlobalBtn = document.getElementById('addGlobalSampleBtn');
        if (addGlobalBtn) {
            addGlobalBtn.addEventListener('click', () => this.addGlobalSampleEntry());
        }

        // Verification & Analysis Modals
        document.getElementById('acceptSampleForm').addEventListener('submit', this.handleAcceptSample.bind(this));
        document.getElementById('rejectSampleForm').addEventListener('submit', this.handleRejectSample.bind(this));
        document.getElementById('analysisResultForm').addEventListener('submit', this.handleSaveAnalysis.bind(this));
        document.getElementById('btnApproveAndSign').addEventListener('click', this.handleApproveReport.bind(this));
        document.getElementById('btnDownloadCertPDF').addEventListener('click', this.generateCertificatePDF.bind(this));
        
        // E-Tracking
        document.getElementById('btnSearchTracking').addEventListener('click', this.handleTrackingSearch.bind(this));
        document.getElementById('btnDownloadTrackingCert').addEventListener('click', () => {
             const trackId = document.getElementById('track-sample-id').textContent.replace('รหัสตัวอย่าง: ', '');
             const sample = this.samples.find(s => s.lab_id === trackId || s.ref_id === trackId);
             if(sample) {
                 this.openCertifyModal(sample.ref_id, true); // Open in view-only mode
             }
        });

        // Export
        document.getElementById('btnFilterApply').addEventListener('click', this.renderExportTable.bind(this));
        document.getElementById('btnDownloadExcel').addEventListener('click', this.downloadExcel.bind(this));
        
        // Live Search Listeners
        document.getElementById('searchVerifyTable').addEventListener('input', this.renderVerifyTable.bind(this));
        document.getElementById('searchAnalysisTable').addEventListener('input', this.renderAnalysisTable.bind(this));
        document.getElementById('searchCertifyTable').addEventListener('input', this.renderCertifyTable.bind(this));
    },

    // View Routing
    switchView(viewId) {
        // Hide all views
        document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
        // Update active menu
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        
        const targetView = document.getElementById(`view-${viewId}`);
        const targetMenu = document.querySelector(`.menu-item[data-view="${viewId}"]`);
        
        if (targetView) targetView.classList.add('active');
        if (targetMenu) {
            targetMenu.classList.add('active');
            document.getElementById('currentViewTitle').innerText = targetMenu.querySelector('span').innerText;
        }

        if (viewId === 'sample-record') {
            this.unreadRecordsCount = 0;
            localStorage.setItem('unread_records_count', '0');
            this.updateSidebarBadges();
        }

        // View-specific initialization / Access control
        switch(viewId) {
            case 'dashboard':
                this.updateDashboardStats();
                if (window.updateDashboardCharts) updateDashboardCharts(this.samples);
                break;
            case 'sample-record':
                if (!this.currentUser) {
                    document.getElementById('record-auth-block').classList.remove('hidden');
                    document.getElementById('record-content-wrapper').classList.add('hidden');
                } else {
                    document.getElementById('record-auth-block').classList.add('hidden');
                    document.getElementById('record-content-wrapper').classList.remove('hidden');
                    // Pre-fill collector name
                    document.getElementById('field-collector-name').value = this.currentUser.fullname;
                    this.renderSavedRecords();
                }
                break;
            case 'lab-verify':
                if (!this.currentUser || this.currentUser.role !== 'lab') {
                    document.getElementById('verify-auth-block').classList.remove('hidden');
                    document.getElementById('verify-content-wrapper').classList.add('hidden');
                } else {
                    document.getElementById('verify-auth-block').classList.add('hidden');
                    document.getElementById('verify-content-wrapper').classList.remove('hidden');
                    this.renderVerifyTable();
                }
                break;
            case 'lab-analysis':
                if (!this.currentUser || this.currentUser.role !== 'lab') {
                    document.getElementById('analysis-auth-block').classList.remove('hidden');
                    document.getElementById('analysis-content-wrapper').classList.add('hidden');
                } else {
                    document.getElementById('analysis-auth-block').classList.add('hidden');
                    document.getElementById('analysis-content-wrapper').classList.remove('hidden');
                    this.renderAnalysisTable();
                }
                break;
            case 'lab-certify':
                if (!this.currentUser || this.currentUser.role !== 'lab') {
                    document.getElementById('certify-auth-block').classList.remove('hidden');
                    document.getElementById('certify-content-wrapper').classList.add('hidden');
                } else {
                    document.getElementById('certify-auth-block').classList.add('hidden');
                    document.getElementById('certify-content-wrapper').classList.remove('hidden');
                    this.renderCertifyTable();
                }
                break;
            case 'data-download':
                if (!this.currentUser) {
                    document.getElementById('download-auth-block').classList.remove('hidden');
                    document.getElementById('download-content-wrapper').classList.add('hidden');
                } else {
                    document.getElementById('download-auth-block').classList.add('hidden');
                    document.getElementById('download-content-wrapper').classList.remove('hidden');
                    this.renderExportTable();
                }
                break;
        }
    },

    updateDashboardStats() {
        const total = this.samples.length;
        const pending = this.samples.filter(s => s.status === 'registered').length;
        const analyzing = this.samples.filter(s => s.status === 'accepted').length;
        const completed = this.samples.filter(s => s.status === 'approved').length;

        document.getElementById('stats-total').innerText = total;
        document.getElementById('stats-pending').innerText = pending;
        document.getElementById('stats-analyzing').innerText = analyzing;
        document.getElementById('stats-completed').innerText = completed;
    },

    // Authentication Logic
    updateAuthUI() {
        const authButtons = document.getElementById('navAuthButtons');
        const userStatusCard = document.getElementById('userStatusCard');
        
        if (this.currentUser) {
            authButtons.innerHTML = `<button class="btn btn-secondary" onclick="app.logout()"><i class="fa-solid fa-arrow-right-from-bracket"></i> ออกจากระบบ</button>`;
            userStatusCard.innerHTML = `
                <div class="user-status-name"><i class="fa-solid fa-circle-user"></i> ${this.currentUser.fullname}</div>
                <div class="user-status-role">${this.currentUser.role === 'lab' ? 'เจ้าหน้าที่ห้องปฏิบัติการ' : 'ผู้เก็บตัวอย่าง'}</div>
            `;
            
            // Show lab menus if role is lab
            document.querySelectorAll('#menu-lab-verify, #menu-lab-analysis, #menu-lab-certify').forEach(el => {
                el.style.display = 'flex';
            });
            
        } else {
            authButtons.innerHTML = `<button class="btn btn-primary" onclick="app.showLoginModal()"><i class="fa-solid fa-user-lock"></i> เข้าสู่ระบบ</button>`;
            userStatusCard.innerHTML = `<div class="user-status-name">ผู้เยี่ยมชมระบบ</div><div class="user-status-role">ยังไม่ได้เข้าสู่ระบบ</div>`;
            
            // Hide lab menus
            document.querySelectorAll('#menu-lab-verify, #menu-lab-analysis, #menu-lab-certify').forEach(el => {
                el.style.display = 'none';
            });
        }
        
        // Re-evaluate current view
        const activeView = document.querySelector('.content-view.active');
        if(activeView) {
            this.switchView(activeView.id.replace('view-', ''));
        }
    },

    showLoginModal(intendedRole = '') {
        document.getElementById('authModal').classList.add('active');
        this.switchAuthTab('login');
    },

    closeAuthModal() {
        document.getElementById('authModal').classList.remove('active');
    },

    switchAuthTab(tab) {
        document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-subform').forEach(form => form.classList.remove('active'));
        
        document.getElementById(`tab-${tab}`).classList.add('active');
        document.getElementById(`${tab}Form`).classList.add('active');
    },

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;

        const user = this.users.find(u => u.username === username && u.password === pass);
        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('sskmoph_session', JSON.stringify(user));
            Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบสำเร็จ',
                text: `ยินดีต้อนรับ ${user.fullname}`,
                timer: 1500,
                showConfirmButton: false
            });
            this.closeAuthModal();
            this.updateAuthUI();
            e.target.reset();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบล้มเหลว',
                text: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'
            });
        }
    },

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const fullname = document.getElementById('reg-fullname').value;
        const role = document.getElementById('reg-role').value;
        const pass = document.getElementById('reg-password').value;

        if (this.users.some(u => u.username === username)) {
            Swal.fire('ข้อผิดพลาด', 'ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว', 'error');
            return;
        }

        const newUser = { username, fullname, role, password: pass };
        this.users.push(newUser);
        localStorage.setItem('sskmoph_users', JSON.stringify(this.users));
        
        Swal.fire({
            icon: 'success',
            title: 'สมัครสมาชิกสำเร็จ',
            text: 'กรุณาลงชื่อเข้าใช้งานด้วยบัญชีที่สมัคร',
            confirmButtonText: 'ตกลง'
        }).then(() => {
            this.switchAuthTab('login');
            e.target.reset();
        });
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('sskmoph_session');
        this.updateAuthUI();
        this.switchView('dashboard');
        Swal.fire({ icon: 'info', title: 'ออกจากระบบแล้ว', timer: 1000, showConfirmButton: false });
    },

    // Forms Logic
    openFormEditor(formType) {
        document.querySelector('.form-selection-grid').classList.add('hidden');
        document.querySelector('.section-title-wrapper').classList.add('hidden');
        document.getElementById('formEditorContainer').classList.remove('hidden');
        
        const recordsWrapper = document.getElementById('savedRecordsContainerWrapper');
        if (recordsWrapper) recordsWrapper.classList.remove('hidden');

        // Clear search input on opening/switching form
        const searchInput = document.getElementById('searchSavedRecords');
        if (searchInput) searchInput.value = '';
        
        document.getElementById('field-form-type').value = formType;
        document.getElementById('formBadgeTitle').innerText = formType;
        
        let title = '';
        let dynamicHTML = '';
        
        // Generate specific fields based on MU type
        switch(formType) {
            case 'MU.10-001':
                title = 'แบบบันทึกการเก็บตัวอย่างผักและผลไม้';
                dynamicHTML = `
                    <div class="form-group">
                        <label>การตรวจหาสารพิษตกค้าง</label>
                        <div class="checkbox-group-container">
                            <div class="checkbox-item"><input type="checkbox" name="test_organo"> <label>ออร์กาโนฟอสเฟต</label></div>
                            <div class="checkbox-item"><input type="checkbox" name="test_carbamate"> <label>คาร์บาเมต</label></div>
                        </div>
                    </div>
                `;
                break;
            case 'MU.10-002':
                title = 'แบบบันทึกการเก็บตัวอย่างสารปนเปื้อน 5 ชนิด';
                dynamicHTML = `
                    <div class="form-group span-2">
                        <label>ชนิดสารปนเปื้อนที่ต้องการส่งตรวจ (เลือกได้มากกว่า 1)</label>
                        <div class="checkbox-group-container">
                            <div class="checkbox-item"><input type="checkbox" name="test_borax" value="บอแรกซ์"> <label>บอแรกซ์</label></div>
                            <div class="checkbox-item"><input type="checkbox" name="test_formalin" value="ฟอร์มาลิน"> <label>ฟอร์มาลิน</label></div>
                            <div class="checkbox-item"><input type="checkbox" name="test_bleach" value="ฟอกขาว"> <label>ฟอกขาว</label></div>
                            <div class="checkbox-item"><input type="checkbox" name="test_salicylic" value="กันรา (ซาลิซิลิค)"> <label>กันรา (ซาลิซิลิค)</label></div>
                            <div class="checkbox-item"><input type="checkbox" name="test_agonist" value="สารเร่งเนื้อแดง"> <label>สารเร่งเนื้อแดง</label></div>
                        </div>
                    </div>
                `;
                break;
            case 'MU.10-003':
                title = 'แบบบันทึกการเก็บตัวอย่างน้ำมันทอดซ้ำ (ด้วยเครื่อง Ebro/Testo)';
                dynamicHTML = `<p class="input-helper">ไม่มีฟิลด์ข้อมูลเฉพาะสำหรับฟอร์มประเภทนี้</p>`;
                break;
            case 'MU.10-004':
                title = 'แบบบันทึกการเก็บตัวอย่างน้ำมันทอดซ้ำ (ด้วยชุดทดสอบ Test Kit)';
                dynamicHTML = `<p class="input-helper">ไม่มีฟิลด์ข้อมูลเฉพาะสำหรับฟอร์มประเภทนี้</p>`;
                break;
            default:
                title = `แบบบันทึกการเก็บตัวอย่าง ${formType}`;
                dynamicHTML = `<p class="input-helper">ไม่มีฟิลด์ข้อมูลเฉพาะสำหรับฟอร์มประเภทนี้</p>`;
        }
        
        document.getElementById('formNameTitle').innerText = title;
        document.getElementById('dynamicFormFields').innerHTML = dynamicHTML;
        
        // Initialize global sample entries
        const globalContainer = document.getElementById('globalSampleEntries');
        if (globalContainer) {
            globalContainer.innerHTML = '';
            this.globalSampleIndex = 0;
            this.addGlobalSampleEntry(); // add at least one entry by default
        }
        
        // Reset PDF button
        document.getElementById('btnExportSubmissionPDF').disabled = true;
        // set today as default date
        document.getElementById('field-sampling-date').valueAsDate = new Date();

        // Render saved records for this specific form type
        this.renderSavedRecords();
    },

    addGlobalSampleEntry() {
        const formType = document.getElementById('field-form-type').value;
        this.globalSampleIndex = (this.globalSampleIndex || 0) + 1;
        const container = document.getElementById('globalSampleEntries');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = 'sample-section';
        div.style.marginTop = '15px';
        div.style.padding = '15px';
        div.style.border = '1px solid var(--border-color)';
        div.style.borderRadius = '8px';
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        
        if (formType === 'MU.10-003') {
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <h4 style="color: var(--primary-light); margin: 0; font-size: 16px;"><i class="fa-solid fa-droplet"></i> รายการน้ำมันทอดซ้ำ #${this.globalSampleIndex}</h4>
                    <button type="button" class="btn btn-text remove-sample-btn" style="color: #ef4444; padding: 5px; font-weight: 500;" onclick="app.removeGlobalSample(this)"><i class="fa-solid fa-trash"></i> ลบรายการนี้</button>
                </div>
                <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label>1. ชื่อผู้จำหน่าย *</label>
                        <input type="text" name="distributor_${this.globalSampleIndex}" required placeholder="ระบุชื่อร้านค้า/ผู้จำหน่าย">
                    </div>
                    <div class="form-group">
                        <label>2. ชนิดอาหาร *</label>
                        <input type="text" name="sample_name_${this.globalSampleIndex}" required placeholder="ระบุชนิดอาหาร เช่น ไก่ทอด, กล้วยแขก">
                    </div>
                    <div class="form-group">
                        <label>3. ชนิดน้ำมัน *</label>
                        <input type="text" name="oil_type_${this.globalSampleIndex}" list="oil-types-list-mu03" required placeholder="ระบุชนิดน้ำมัน เช่น น้ำมันปาล์ม">
                        <datalist id="oil-types-list-mu03">
                            <option value="น้ำมันปาล์ม">
                            <option value="น้ำมันถั่วเหลือง">
                            <option value="น้ำมันหมู">
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>4. ระยะเวลาใช้ทอด (นาที) *</label>
                        <input type="number" name="fry_duration_${this.globalSampleIndex}" required min="0" placeholder="ระบุเวลาเป็นนาที">
                    </div>
                    <div class="form-group">
                        <label>5. ลักษณะการเปลี่ยน *</label>
                        <select name="replacement_type_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือกลักษณะการเปลี่ยน --</option>
                            <option value="ไม่เปลี่ยนเลย">ไม่เปลี่ยนเลย</option>
                            <option value="เปลี่ยนบางส่วน">เปลี่ยนบางส่วน</option>
                            <option value="เปลี่ยนใหม่ทั้งหมด">เปลี่ยนใหม่ทั้งหมด</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>6. วันที่เปลี่ยนล่าสุด *</label>
                        <input type="date" name="last_replacement_date_${this.globalSampleIndex}" required style="height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-family: inherit; font-size: 14px;">
                    </div>
                    <div class="form-group">
                        <label>7. ความถี่ในการเปลี่ยน (วัน) *</label>
                        <input type="number" name="replacement_frequency_${this.globalSampleIndex}" required min="0" placeholder="ระบุความถี่เป็นวัน">
                    </div>
                    <div class="form-group">
                        <label>8. เหตุผลที่เปลี่ยน *</label>
                        <select name="replacement_reason_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือกเหตุผลที่เปลี่ยน --</option>
                            <option value="สภาพน้ำมันเปลี่ยน">สภาพน้ำมันเปลี่ยน</option>
                            <option value="สภาพอาหารเปลี่ยน">สภาพอาหารเปลี่ยน</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>9. การกำจัดน้ำมัน *</label>
                        <select name="oil_disposal_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือกวิธีการกำจัด --</option>
                            <option value="เก็บรวบรวมขายต่อ">เก็บรวบรวมขายต่อ</option>
                            <option value="ทิ้งระบบสาธารณะ">ทิ้งระบบสาธารณะ</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>10. ค่าโพลาร์ (%) *</label>
                        <input type="number" step="0.1" min="0" max="100" name="polar_value_${this.globalSampleIndex}" required placeholder="ระบุค่า % เช่น 24.5">
                    </div>
                </div>
            `;
        } else if (formType === 'MU.10-004') {
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <h4 style="color: var(--primary-light); margin: 0; font-size: 16px;"><i class="fa-solid fa-droplet"></i> รายการตรวจด้วย Test Kit #${this.globalSampleIndex}</h4>
                    <button type="button" class="btn btn-text remove-sample-btn" style="color: #ef4444; padding: 5px; font-weight: 500;" onclick="app.removeGlobalSample(this)"><i class="fa-solid fa-trash"></i> ลบรายการนี้</button>
                </div>
                <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label>1. ประเภทอาหาร *</label>
                        <select name="food_category_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือกประเภทอาหาร --</option>
                            <option value="พวกแป้ง เช่น ปาท่องโก๋ กล้วยแขก มันทอด ขนมไข่นกกระทา">พวกแป้ง เช่น ปาท่องโก๋ กล้วยแขก มันทอด ขนมไข่นกกระทา</option>
                            <option value="เนื้อสัตว์ เช่น ไก่ทอด ปลาทอด หมูทอด ฯลฯ">เนื้อสัตว์ เช่น ไก่ทอด ปลาทอด หมูทอด ฯลฯ</option>
                            <option value="ผลิตภัณฑ์จากเนื้อสัตว์ เช่น ลูกชิ้น ไส้กรอก ฯลฯ">ผลิตภัณฑ์จากเนื้อสัตว์ เช่น ลูกชิ้น ไส้กรอก ฯลฯ</option>
                            <option value="พวกผสม เช่น ไก่ชุบแป้งทอด ปลาชุบแป้งทอด ฯลฯ">พวกผสม เช่น ไก่ชุบแป้งทอด ปลาชุบแป้งทอด ฯลฯ</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>2. ระบุชนิดอาหาร *</label>
                        <input type="text" name="sample_name_${this.globalSampleIndex}" required placeholder="ระบุชนิดอาหาร เช่น ไก่ทอด, กล้วยแขก">
                    </div>
                    <div class="form-group">
                        <label>3. ชนิดน้ำมัน *</label>
                        <input type="text" name="oil_type_${this.globalSampleIndex}" list="oil-types-list-mu04" required placeholder="ระบุชนิดน้ำมัน เช่น น้ำมันปาล์ม">
                        <datalist id="oil-types-list-mu04">
                            <option value="น้ำมันปาล์ม">
                            <option value="น้ำมันถั่วเหลือง">
                            <option value="น้ำมันหมู">
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>4. ระยะเวลาใช้ทอด (นาที/ครั้ง) *</label>
                        <input type="number" name="fry_duration_${this.globalSampleIndex}" required min="0" placeholder="ระบุเวลาเป็นนาที">
                    </div>
                    <div class="form-group">
                        <label>5. จำนวนครั้งที่ทอด (ครั้ง/วัน) *</label>
                        <input type="number" name="fry_count_${this.globalSampleIndex}" required min="0" placeholder="ระบุจำนวนครั้ง">
                    </div>
                    <div class="form-group">
                        <label>6. ลักษณะการเปลี่ยนน้ำมัน *</label>
                        <select name="replacement_type_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือกลักษณะการเปลี่ยน --</option>
                            <option value="ไม่เปลี่ยนเลย">ไม่เปลี่ยนเลย</option>
                            <option value="เปลี่ยนบางส่วน">เปลี่ยนบางส่วน</option>
                            <option value="เปลี่ยนใหม่ทั้งหมด">เปลี่ยนใหม่ทั้งหมด</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>7. ความถี่ในการเปลี่ยนน้ำมัน (วัน) *</label>
                        <input type="number" name="replacement_frequency_${this.globalSampleIndex}" required min="0" placeholder="ระบุจำนวนวัน">
                    </div>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="color: var(--primary-light); margin: 0;">รายการตัวอย่าง</h4>
                    <button type="button" class="btn btn-text remove-sample-btn" style="color: red; padding: 5px;" onclick="app.removeGlobalSample(this)"><i class="fa-solid fa-trash"></i> ลบ</button>
                </div>
                <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label>ชื่อตัวอย่าง *</label>
                        <input type="text" name="sample_name_${this.globalSampleIndex}" required placeholder="เช่น ผักกาดขาว, น้ำดื่มบรรจุขวด">
                    </div>
                    <div class="form-group">
                        <label>ชื่อผู้จัดจำหน่าย / ผู้ผลิต *</label>
                        <input type="text" name="distributor_${this.globalSampleIndex}" required placeholder="เช่น แผงผัก ป้าแดง">
                    </div>
                    <div class="form-group">
                        <label>น้ำหนัก (กรัม)</label>
                        <input type="number" name="weight_${this.globalSampleIndex}" step="0.1" placeholder="เช่น 500">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label>แหล่งที่มาของตัวอย่าง *</label>
                        <input type="text" name="source_${this.globalSampleIndex}" required placeholder="เช่น ตลาดไท, รับซื้อจากเกษตรกร">
                    </div>
                </div>
            `;
        }
        container.appendChild(div);
        this.updateTotalGlobalSamples();
    },

    removeGlobalSample(btn) {
        const sampleSection = btn.closest('.sample-section');
        if (sampleSection) {
            sampleSection.remove();
            this.updateTotalGlobalSamples();
        }
    },

    updateTotalGlobalSamples() {
        const container = document.getElementById('globalSampleEntries');
        const qtyField = document.getElementById('field-sample-qty');
        if (container && qtyField) {
            const count = container.querySelectorAll('.sample-section').length;
            qtyField.value = count;
        }
    },

    generateRefId(formType) {
        const formNum = formType.split('-')[1]; // e.g. '001'
        const today = new Date();
        const beYear = today.getFullYear() + 543;
        const yy = String(beYear).slice(-2);
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = yy + mm + dd; // e.g. '690731'

        // Find max sequence for today
        let maxSeq = 0;
        this.samples.forEach(s => {
            if (s.ref_id && s.ref_id.includes('-' + dateStr)) {
                const parts = s.ref_id.split('-');
                if (parts.length === 2) {
                    const seqPart = parts[1].substring(6); // remove the 6-digit date
                    const seq = parseInt(seqPart, 10);
                    if (!isNaN(seq) && seq > maxSeq) {
                        maxSeq = seq;
                    }
                }
            }
        });

        const nextSeq = maxSeq + 1;
        const seqStr = String(nextSeq).padStart(3, '0');
        return `MU${formNum}-${dateStr}${seqStr}`;
    },

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(e.target);
        const sampleData = Object.fromEntries(formData.entries());
        
        let tempId = '';
        if (this.currentEditingRefId) {
            // Updating existing record
            tempId = this.currentEditingRefId;
            const index = this.samples.findIndex(s => s.ref_id === tempId);
            if (index !== -1) {
                const oldSample = this.samples[index];
                
                // Security Check
                const owner = oldSample.created_by || 'user';
                const canEditOrCancel = (owner === this.currentUser.username) || (this.currentUser.username === 'admin');
                if (!canEditOrCancel) {
                    Swal.fire('ข้อผิดพลาด', 'คุณไม่มีสิทธิ์แก้ไขรายการนี้', 'error');
                    return;
                }

                // Clear old dynamic keys since number of samples or checkboxes might change
                Object.keys(oldSample).forEach(key => {
                    if (key.startsWith('sample_name_') || key.startsWith('distributor_') || key.startsWith('weight_') || key.startsWith('source_') || key.startsWith('test_') ||
                        key.startsWith('oil_type_') || key.startsWith('fry_duration_') || key.startsWith('fry_count_') || key.startsWith('replacement_type_') ||
                        key.startsWith('last_replacement_date_') || key.startsWith('replacement_frequency_') || key.startsWith('replacement_reason_') ||
                        key.startsWith('oil_disposal_') || key.startsWith('polar_value_') || key.startsWith('food_category_')) {
                        delete oldSample[key];
                    }
                });

                const updatedSample = Object.assign(oldSample, sampleData);
                this.samples[index] = updatedSample;
                this.saveSamples();
                this.currentEditingRefId = null;
            }
            
            Swal.fire({
                icon: 'success',
                title: 'อัปเดตข้อมูลสำเร็จ',
                text: 'การแก้ไขข้อมูลถูกบันทึกเข้าระบบแล้ว',
                confirmButtonText: 'ตกลง'
            });

            // Reset submit button text
            const submitBtn = document.querySelector('#sampleSubmissionForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึกข้อมูลเข้าระบบ';
                submitBtn.className = 'btn btn-success';
            }
        } else {
            // Creating new record
            tempId = this.generateRefId(sampleData.form_type);
            sampleData.ref_id = tempId;
            sampleData.status = 'registered';
            sampleData.created_at = new Date().toISOString();
            sampleData.created_by = this.currentUser.username; // Save creator!
            
            this.samples.unshift(sampleData);
            this.saveSamples();
            
            // Increment unread count for sidebar badge
            this.unreadRecordsCount = (this.unreadRecordsCount || 0) + 1;
            localStorage.setItem('unread_records_count', this.unreadRecordsCount.toString());
            this.updateSidebarBadges();
            
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลเข้าระบบสำเร็จ',
                html: `รหัสอ้างอิงของคุณคือ: <b>${tempId}</b><br>กรุณาดาวน์โหลดแบบฟอร์ม PDF เพื่อแนบส่งพร้อมตัวอย่าง`,
                confirmButtonText: 'ตกลง'
            });
        }
        
        // Enable PDF Download immediately on the same form page
        const pdfBtn = document.getElementById('btnExportSubmissionPDF');
        if (pdfBtn) {
            pdfBtn.disabled = false;
            pdfBtn.dataset.refId = tempId;
        }

        this.renderSavedRecords();
        this.updateDashboardStats();
        if (window.updateDashboardCharts) updateDashboardCharts(this.samples);
    },

    renderSavedRecords() {
        const tbody = document.getElementById('savedRecordsTableBody');
        if (!tbody) return;

        // Find only 'registered' samples (not yet verified/approved by lab)
        let mySavedSamples = this.samples.filter(s => s.status === 'registered');

        // Filter by current form type
        const currentFormType = document.getElementById('field-form-type')?.value;
        if (currentFormType) {
            mySavedSamples = mySavedSamples.filter(s => s.form_type === currentFormType);
        }

        // Filter by search query
        const searchInput = document.getElementById('searchSavedRecords');
        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
        if (searchVal) {
            mySavedSamples = mySavedSamples.filter(s => {
                const sampleNames = [];
                let idx = 1;
                while (s['sample_name_' + idx] !== undefined) {
                    if (s['sample_name_' + idx]) sampleNames.push(s['sample_name_' + idx]);
                    idx++;
                }
                if (sampleNames.length === 0 && s.sample_name) {
                    sampleNames.push(s.sample_name);
                }
                const sampleDesc = sampleNames.join(', ');

                return (
                    (s.ref_id && s.ref_id.toLowerCase().includes(searchVal)) ||
                    (sampleDesc && sampleDesc.toLowerCase().includes(searchVal)) ||
                    (s.location_name && s.location_name.toLowerCase().includes(searchVal)) ||
                    (s.collector_name && s.collector_name.toLowerCase().includes(searchVal)) ||
                    (s.agency && s.agency.toLowerCase().includes(searchVal))
                );
            });
        }

        tbody.innerHTML = '';

        if (mySavedSamples.length === 0) {
            const noDataMsg = searchVal ? 'ไม่มีรายการข้อมูลที่ตรงกับการค้นหา' : 'ไม่มีรายการข้อมูลที่บันทึกรอการตรวจสอบ';
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #888;">
                        <i class="fa-solid fa-folder-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                        ${noDataMsg}
                    </td>
                </tr>
            `;
            return;
        }

        mySavedSamples.forEach(s => {
            // Collect all sample names in this record
            const sampleNames = [];
            let idx = 1;
            while (s['sample_name_' + idx] !== undefined) {
                if (s['sample_name_' + idx]) sampleNames.push(s['sample_name_' + idx]);
                idx++;
            }
            if (sampleNames.length === 0 && s.sample_name) {
                sampleNames.push(s.sample_name);
            }
            const sampleDesc = sampleNames.join(', ') || 'ไม่ได้ระบุชื่อตัวอย่าง';

            let dateStr = '';
            if (s.created_at) {
                try { dateStr = new Date(s.created_at).toLocaleDateString('th-TH', {year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) + ' น.'; } catch(ex) { dateStr = s.created_at; }
            } else {
                dateStr = s.sampling_date || '-';
            }

            // Security check for rendering actions
            const owner = s.created_by || 'user';
            const canEditOrCancel = (owner === this.currentUser.username) || (this.currentUser.username === 'admin');

            let actionButtons = '';
            if (canEditOrCancel) {
                actionButtons = `
                    <button class="btn btn-sm btn-primary" onclick="app.editSavedRecord('${s.ref_id}')" style="padding: 4px 10px; font-size: 11.5px; border-radius: 4px;"><i class="fa-solid fa-pen-to-square"></i> แก้ไข</button>
                    <button class="btn btn-sm btn-danger" onclick="app.cancelSavedRecord('${s.ref_id}')" style="padding: 4px 10px; font-size: 11.5px; border-radius: 4px; background-color: #dc3545; border-color: #dc3545;"><i class="fa-solid fa-trash"></i> ยกเลิก</button>
                `;
            } else {
                actionButtons = `
                    <button class="btn btn-sm" disabled style="padding: 4px 10px; font-size: 11.5px; border-radius: 4px; background-color: #ccc; border-color: #ccc; color: #666; cursor: not-allowed;" title="ไม่มีสิทธิ์แก้ไข (เฉพาะผู้บันทึกและแอดมิน)"><i class="fa-solid fa-lock"></i> แก้ไข</button>
                    <button class="btn btn-sm" disabled style="padding: 4px 10px; font-size: 11.5px; border-radius: 4px; background-color: #ccc; border-color: #ccc; color: #666; cursor: not-allowed;" title="ไม่มีสิทธิ์ยกเลิก (เฉพาะผู้บันทึกและแอดมิน)"><i class="fa-solid fa-lock"></i> ยกเลิก</button>
                `;
            }

            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = `
                <td style="padding: 12px 15px; font-weight: bold; color: var(--primary-light);">${s.ref_id}</td>
                <td style="padding: 12px 15px;"><span class="badge" style="background-color: var(--primary-dark); color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">${s.form_type}</span></td>
                <td style="padding: 12px 15px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sampleDesc}</td>
                <td style="padding: 12px 15px; font-size: 12px; line-height: 1.4;">
                   <div><b>สถานที่:</b> ${s.location_name || '-'}</div>
                   <div><b>ผู้เก็บ:</b> ${s.collector_name || '-'}</div>
                </td>
                <td style="padding: 12px 15px; font-size: 12px; color: #666;">${dateStr}</td>
                <td style="padding: 12px 15px; text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        ${actionButtons}
                        <button class="btn btn-sm btn-secondary" onclick="app.downloadSubmissionPDFDirect('${s.ref_id}')" style="padding: 4px 10px; font-size: 11.5px; border-radius: 4px; background-color: #6c757d; border-color: #6c757d;"><i class="fa-solid fa-file-pdf"></i> PDF</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    downloadSubmissionPDFDirect(refId) {
        const mockEvent = {
            currentTarget: {
                dataset: {
                    refId: refId
                }
            }
        };
        this.generateSubmissionPDF(mockEvent);
    },

    cancelSavedRecord(refId) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if (!sample) return;

        const owner = sample.created_by || 'user';
        const canEditOrCancel = (owner === this.currentUser.username) || (this.currentUser.username === 'admin');
        if (!canEditOrCancel) {
            Swal.fire('ข้อผิดพลาด', 'คุณไม่มีสิทธิ์ยกเลิกรายการนี้ (สิทธิ์เฉพาะผู้บันทึกข้อมูลและแอดมิน)', 'error');
            return;
        }

        Swal.fire({
            title: 'ยืนยันการยกเลิกรายการ?',
            text: `คุณต้องการยกเลิกและลบรายการข้อมูลตัวอย่างรหัส ${refId} หรือไม่? การกระทำนี้ไม่สามารถย้อนคืนได้`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ต้องการยกเลิกและลบ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const index = this.samples.findIndex(s => s.ref_id === refId);
                if (index !== -1) {
                    this.samples.splice(index, 1);
                    this.saveSamples();
                    this.renderSavedRecords();
                    this.updateDashboardStats();
                    if (window.updateDashboardCharts) updateDashboardCharts(this.samples);
                    Swal.fire(
                        'ลบข้อมูลสำเร็จ!',
                        'ข้อมูลตัวอย่างถูกลบออกจากระบบแล้ว',
                        'success'
                    );
                }
            }
        });
    },

    editSavedRecord(refId) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if (!sample) return;

        const owner = sample.created_by || 'user';
        const canEditOrCancel = (owner === this.currentUser.username) || (this.currentUser.username === 'admin');
        if (!canEditOrCancel) {
            Swal.fire('ข้อผิดพลาด', 'คุณไม่มีสิทธิ์แก้ไขรายการนี้ (สิทธิ์เฉพาะผู้บันทึกข้อมูลและแอดมิน)', 'error');
            return;
        }

        // 1. Open the form editor
        this.openFormEditor(sample.form_type);

        // 2. Hide the saved records container
        document.getElementById('savedRecordsContainerWrapper').classList.add('hidden');

        // 3. Pre-fill basic fields
        document.getElementById('field-agency').value = sample.agency || '';
        document.getElementById('field-location-type').value = sample.location_type || '';
        document.getElementById('field-location-name').value = sample.location_name || '';
        document.getElementById('field-province').value = sample.province || '';
        document.getElementById('field-amphoe').value = sample.amphoe || '';
        document.getElementById('field-tambon').value = sample.tambon || '';
        document.getElementById('field-collector-name').value = sample.collector_name || '';
        document.getElementById('field-sampling-date').value = sample.sampling_date || '';

        // 4. Fill dynamic sample rows
        const container = document.getElementById('globalSampleEntries');
        container.innerHTML = '';
        this.globalSampleIndex = 0;

        let idx = 1;
        while (sample['sample_name_' + idx] !== undefined) {
            this.addGlobalSampleEntry();
            const lastSection = container.lastElementChild;
            if (lastSection) {
                const inputs = lastSection.querySelectorAll('input, select');
                inputs.forEach(input => {
                    const baseName = input.name.replace(/_\d+$/, '');
                    const sampleKey = `${baseName}_${idx}`;
                    if (sample[sampleKey] !== undefined) {
                        if (input.type === 'checkbox') {
                            input.checked = sample[sampleKey] === 'on' || sample[sampleKey] === true;
                        } else {
                            input.value = sample[sampleKey];
                        }
                    }
                });
            }
            idx++;
        }

        // If it was old single sample structure
        if (this.globalSampleIndex === 0 && sample.sample_name) {
            this.addGlobalSampleEntry();
            const lastSection = container.lastElementChild;
            if (lastSection) {
                lastSection.querySelector(`input[name="sample_name_1"]`).value = sample.sample_name || '';
                lastSection.querySelector(`input[name="distributor_1"]`).value = sample.distributor || '';
                lastSection.querySelector(`input[name="weight_1"]`).value = '';
                lastSection.querySelector(`input[name="source_1"]`).value = sample.source || '';
            }
        }

        // 5. Pre-fill form-specific dynamic fields (checkboxes, number inputs)
        setTimeout(() => {
            const formFieldsContainer = document.getElementById('dynamicFormFields');
            if (formFieldsContainer) {
                // Check checkboxes
                formFieldsContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
                    if (sample[chk.name] !== undefined) {
                        chk.checked = sample[chk.name] === 'on' || sample[chk.name] === true;
                    }
                });
                // Fill other inputs
                formFieldsContainer.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
                    if (sample[input.name] !== undefined) {
                        input.value = sample[input.name];
                    }
                });
            }
        }, 50);

        // 6. Set the editing ref ID in state
        this.currentEditingRefId = refId;
        
        // 7. Enable PDF button for editing
        document.getElementById('btnExportSubmissionPDF').disabled = false;
        document.getElementById('btnExportSubmissionPDF').dataset.refId = refId;

        // 8. Update save button text and style
        const submitBtn = document.querySelector('#sampleSubmissionForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> อัปเดตการแก้ไขข้อมูล';
            submitBtn.className = 'btn btn-primary';
        }
    },

    // Lab Verify Logic
    renderVerifyTable() {
        const tbody = document.getElementById('verifyTableBody');
        const searchTerm = document.getElementById('searchVerifyTable').value.toLowerCase();
        
        // Show only 'registered' status
        const pendingSamples = this.samples.filter(s => s.status === 'registered');
        
        tbody.innerHTML = '';
        
        pendingSamples.forEach(s => {
            if (searchTerm && !`${s.ref_id} ${s.sample_name} ${s.province}`.toLowerCase().includes(searchTerm)) return;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.ref_id}</strong></td>
                <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${s.form_type}</span></td>
                <td>${s.sample_name}</td>
                <td>${s.location_name} จ.${s.province}</td>
                <td>${new Date(s.created_at).toLocaleDateString('th-TH')}</td>
                <td><span class="status-badge status-registered">รอตรวจรับ</span></td>
                <td>
                    <button class="btn btn-success btn-text" onclick="app.openVerifyAcceptModal('${s.ref_id}')"><i class="fa-solid fa-check"></i> รับ</button>
                    <button class="btn btn-danger btn-text" onclick="app.openVerifyRejectModal('${s.ref_id}')"><i class="fa-solid fa-xmark"></i> ปฏิเสธ</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        if (tbody.innerHTML === '') {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">ไม่มีรายการที่รอตรวจสอบ</td></tr>';
        }
    },

    openVerifyAcceptModal(refId) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if(!sample) return;
        
        document.getElementById('accept-sample-ref-id').value = sample.ref_id;
        document.getElementById('accept-sample-ref-display').value = sample.ref_id;
        document.getElementById('accept-sample-name-display').value = sample.sample_name;
        
        // Generate auto Lab ID
        const year = new Date().getFullYear() + 543; // Thai year
        const prefix = this.getProvincePrefix(sample.province);
        const count = this.samples.filter(s => s.lab_id && s.lab_id.startsWith(prefix)).length + 1;
        document.getElementById('accept-lab-id').value = `${prefix}-${year}-${String(count).padStart(4, '0')}`;
        document.getElementById('accept-receive-date').valueAsDate = new Date();
        
        document.getElementById('verifyAcceptModal').classList.add('active');
    },

    closeVerifyAcceptModal() {
        document.getElementById('verifyAcceptModal').classList.remove('active');
    },

    getProvincePrefix(province) {
        const map = { 'ศรีสะเกษ': 'SSK', 'อุบลราชธานี': 'UBN', 'อำนาจเจริญ': 'AMN', 'มุกดาหาร': 'MDH', 'ยโสธร': 'YST' };
        return map[province] || 'LAB';
    },

    handleAcceptSample(e) {
        e.preventDefault();
        const refId = document.getElementById('accept-sample-ref-id').value;
        const labId = document.getElementById('accept-lab-id').value;
        
        const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
        if (sampleIndex > -1) {
            this.samples[sampleIndex].status = 'accepted';
            this.samples[sampleIndex].lab_id = labId;
            this.samples[sampleIndex].lab_receive_date = document.getElementById('accept-receive-date').value;
            this.saveSamples();
            
            Swal.fire('สำเร็จ', `รับตัวอย่างเข้าระบบเรียบร้อย<br>รหัส: ${labId}`, 'success');
            this.closeVerifyAcceptModal();
            this.renderVerifyTable();
        }
    },

    openVerifyRejectModal(refId) {
         const sample = this.samples.find(s => s.ref_id === refId);
        if(!sample) return;
        
        document.getElementById('reject-sample-ref-id').value = sample.ref_id;
        document.getElementById('reject-sample-ref-display').value = sample.ref_id;
        document.getElementById('verifyRejectModal').classList.add('active');
    },

    closeVerifyRejectModal() {
        document.getElementById('verifyRejectModal').classList.remove('active');
    },

    handleRejectSample(e) {
        e.preventDefault();
        const refId = document.getElementById('reject-sample-ref-id').value;
        const reason = document.getElementById('reject-reason').value;
        const detail = document.getElementById('reject-detail').value;
        
        const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
        if (sampleIndex > -1) {
            this.samples[sampleIndex].status = 'rejected';
            this.samples[sampleIndex].reject_reason = reason;
            this.samples[sampleIndex].reject_detail = detail;
            this.saveSamples();
            
            Swal.fire('ปฏิเสธการรับ', `บันทึกการปฏิเสธตัวอย่างเรียบร้อย`, 'info');
            this.closeVerifyRejectModal();
            this.renderVerifyTable();
        }
    },

    // Lab Analysis Logic
    renderAnalysisTable() {
        const tbody = document.getElementById('analysisTableBody');
        const searchTerm = document.getElementById('searchAnalysisTable').value.toLowerCase();
        
        // Show accepted or summarized
        const activeSamples = this.samples.filter(s => ['accepted', 'summarized'].includes(s.status));
        
        tbody.innerHTML = '';
        
        activeSamples.forEach(s => {
            if (searchTerm && !`${s.lab_id} ${s.sample_name}`.toLowerCase().includes(searchTerm)) return;
            
            const tr = document.createElement('tr');
            const statusBadge = s.status === 'accepted' 
                ? '<span class="status-badge status-analyzing">กำลังวิเคราะห์</span>'
                : '<span class="status-badge status-summarized">สรุปผลแล้ว</span>';
                
            tr.innerHTML = `
                <td><strong>${s.lab_id}</strong></td>
                <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${s.form_type}</span></td>
                <td>${s.sample_name}</td>
                <td>${s.location_name} จ.${s.province}</td>
                <td>${new Date(s.lab_receive_date || s.created_at).toLocaleDateString('th-TH')}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-primary btn-text" onclick="app.openAnalysisInputModal('${s.ref_id}')"><i class="fa-solid fa-pen-to-square"></i> บันทึกผล</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        if (tbody.innerHTML === '') {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">ไม่มีรายการที่อยู่ระหว่างวิเคราะห์</td></tr>';
        }
    },

    openAnalysisInputModal(refId) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if(!sample) return;
        
        document.getElementById('analysisResultForm').reset();
        document.getElementById('analysis-sample-ref-id').value = sample.ref_id;
        document.getElementById('analysis-lab-id-display').value = sample.lab_id;
        document.getElementById('analysis-sample-name-display').value = sample.sample_name;
        
        // Pre-fill if exists
        document.getElementById('analysis-analyst').value = sample.analysis_analyst || this.currentUser.fullname;
        document.getElementById('analysis-date').value = sample.analysis_date || new Date().toISOString().split('T')[0];
        if (sample.analysis_details) document.getElementById('analysis-detail-results').value = sample.analysis_details;
        if (sample.analysis_summary) document.getElementById('analysis-summary-outcome').value = sample.analysis_summary;
        
        document.getElementById('analysisInputModal').classList.add('active');
    },

    closeAnalysisInputModal() {
        document.getElementById('analysisInputModal').classList.remove('active');
    },

    handleSaveAnalysis(e) {
        e.preventDefault();
        const refId = document.getElementById('analysis-sample-ref-id').value;
        const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
        
        if (sampleIndex > -1) {
            this.samples[sampleIndex].status = 'summarized';
            this.samples[sampleIndex].analysis_analyst = document.getElementById('analysis-analyst').value;
            this.samples[sampleIndex].analysis_date = document.getElementById('analysis-date').value;
            this.samples[sampleIndex].analysis_details = document.getElementById('analysis-detail-results').value;
            this.samples[sampleIndex].analysis_summary = document.getElementById('analysis-summary-outcome').value;
            this.samples[sampleIndex].analysis_comment = document.getElementById('analysis-comment').value;
            
            this.saveSamples();
            Swal.fire('บันทึกผลสำเร็จ', 'ผลวิเคราะห์ถูกส่งไปยังหน้าอนุมัติรายงานแล้ว', 'success');
            this.closeAnalysisInputModal();
            this.renderAnalysisTable();
        }
    },

    // Certification Logic
    renderCertifyTable() {
        const tbody = document.getElementById('certifyTableBody');
        const searchTerm = document.getElementById('searchCertifyTable').value.toLowerCase();
        
        const reportSamples = this.samples.filter(s => ['summarized', 'approved'].includes(s.status));
        
        tbody.innerHTML = '';
        
        reportSamples.forEach(s => {
            if (searchTerm && !`${s.lab_id} ${s.sample_name}`.toLowerCase().includes(searchTerm)) return;
            
            const isApproved = s.status === 'approved';
            const actionBtn = isApproved 
                ? `<button class="btn btn-secondary btn-text" onclick="app.openCertifyModal('${s.ref_id}', true)"><i class="fa-solid fa-file-pdf"></i> ดูรายงาน PDF</button>`
                : `<button class="btn btn-success btn-text" onclick="app.openCertifyModal('${s.ref_id}')"><i class="fa-solid fa-stamp"></i> อนุมัติ</button>`;
                
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.lab_id}</strong></td>
                <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${s.form_type}</span></td>
                <td>${s.sample_name}</td>
                <td><small>${s.analysis_details.substring(0, 30)}...</small></td>
                <td><span class="status-badge ${s.analysis_summary.includes('ไม่ผ่าน') ? 'status-rejected' : 'status-approved'}">${s.analysis_summary}</span></td>
                <td>${s.analysis_analyst}</td>
                <td>${actionBtn}</td>
            `;
            tbody.appendChild(tr);
        });
        
         if (tbody.innerHTML === '') {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">ไม่มีรายงานที่รออนุมัติ</td></tr>';
        }
    },

    openCertifyModal(refId, viewOnly = false) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if(!sample) return;
        
        // Fill Certificate Template
        document.getElementById('cert-pdf-no').innerText = sample.lab_id;
        document.getElementById('cert-pdf-date').innerText = new Date().toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'});
        document.getElementById('cert-pdf-form-type').innerText = sample.form_type;
        document.getElementById('cert-pdf-sample-name').innerText = sample.sample_name;
        document.getElementById('cert-pdf-sample-qty').innerText = sample.sample_qty;
        document.getElementById('cert-pdf-location').innerText = `${sample.location_name} จ.${sample.province}`;
        document.getElementById('cert-pdf-collector').innerText = `${sample.collector_name} (${sample.agency})`;
        document.getElementById('cert-pdf-date-recv').innerText = new Date(sample.lab_receive_date || sample.created_at).toLocaleDateString('th-TH');
        
        document.getElementById('cert-pdf-analyst').innerText = sample.analysis_analyst;
        document.getElementById('cert-pdf-results-details').innerText = sample.analysis_details;
        
        const summaryEl = document.getElementById('cert-pdf-summary');
        summaryEl.innerText = sample.analysis_summary;
        if(sample.analysis_summary.includes('ไม่ผ่าน')) {
            summaryEl.style.color = '#ef4444';
            summaryEl.style.borderColor = '#ef4444';
        } else {
            summaryEl.style.color = '#10b981';
            summaryEl.style.borderColor = '#10b981';
        }

        // Setup Controls
        if(viewOnly || sample.status === 'approved') {
            document.getElementById('certApprovalControls').classList.add('hidden');
            document.getElementById('certExportControls').classList.remove('hidden');
            
            // Show Signature
            document.getElementById('cert-pdf-approver-name').innerText = sample.approver_name;
            document.getElementById('cert-pdf-signature-image').innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Signature_of_John_Hancock.svg" class="official-signature-img" style="filter: hue-rotate(200deg) brightness(0.5);">`; // Mock signature image
        } else {
            document.getElementById('certApprovalControls').classList.remove('hidden');
            document.getElementById('certExportControls').classList.add('hidden');
            document.getElementById('approve-officer-name').value = this.currentUser.fullname;
            document.getElementById('cert-pdf-approver-name').innerText = '(รอการลงนาม)';
            document.getElementById('cert-pdf-signature-image').innerHTML = `<span class="placeholder-signature">(ลงนามรับรองอิเล็กทรอนิกส์)</span>`;
            
            // Attach refId to approve button
            document.getElementById('btnApproveAndSign').dataset.refId = refId;
        }

        document.getElementById('certifyModal').classList.add('active');
    },

    closeCertifyModal() {
        document.getElementById('certifyModal').classList.remove('active');
    },

    handleApproveReport(e) {
        const refId = e.currentTarget.dataset.refId;
        const approverName = document.getElementById('approve-officer-name').value;
        if(!approverName) return;

        const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
        if (sampleIndex > -1) {
            this.samples[sampleIndex].status = 'approved';
            this.samples[sampleIndex].approver_name = approverName;
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
        }
    },

    // PDF Generation
    generateCertificatePDF() {
        const element = document.getElementById('certificatePDFContainer');
        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        const currentScrollX = window.scrollX || window.pageXOffset || 0;
        const opt = {
            margin:       10,
            filename:     `Certificate_${document.getElementById('cert-pdf-no').innerText}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: false,
                scrollX: currentScrollX,
                scrollY: currentScrollY
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    },

    generateSubmissionPDF(e) {
        try {
            const refId = e.currentTarget.dataset.refId;
            const sample = this.samples.find(s => s.ref_id === refId);
            if(!sample) return;

        // Document Details mapping based on formType
        let documentName = 'แบบบันทึกการส่งตัวอย่างอาหาร (กลุ่มผักและผลไม้)';
        let documentNum = 'MU.10-001';
        if (sample.form_type === 'MU.10-002') {
            documentName = 'แบบบันทึกการเก็บตัวอย่างสารปนเปื้อน 5 ชนิด';
            documentNum = 'MU.10-002';
        } else if (sample.form_type === 'MU.10-003') {
            documentName = 'แบบบันทึกการเก็บตัวอย่างน้ำมันทอดซ้ำ (ด้วยเครื่อง Ebro/Testo)';
            documentNum = 'MU.10-003';
        } else if (sample.form_type === 'MU.10-004') {
            documentName = 'แบบบันทึกการเก็บตัวอย่างน้ำมันทอดซ้ำ (ด้วยชุดทดสอบ Test Kit)';
            documentNum = 'MU.10-004';
        }

        // Collect all dynamic sample entries from sample object keys
        const sampleItems = [];
        let idx = 1;
        while (sample[`sample_name_${idx}`] !== undefined) {
            if (sample.form_type === 'MU.10-003') {
                sampleItems.push({
                    distributor: sample[`distributor_${idx}`] || '',
                    food_type: sample[`sample_name_${idx}`] || '',
                    oil_type: sample[`oil_type_${idx}`] || '',
                    fry_duration: sample[`fry_duration_${idx}`] || '',
                    replacement_type: sample[`replacement_type_${idx}`] || '',
                    last_replacement_date: sample[`last_replacement_date_${idx}`] || '',
                    replacement_frequency: sample[`replacement_frequency_${idx}`] || '',
                    replacement_reason: sample[`replacement_reason_${idx}`] || '',
                    oil_disposal: sample[`oil_disposal_${idx}`] || '',
                    polar_value: sample[`polar_value_${idx}`] || ''
                });
            } else if (sample.form_type === 'MU.10-004') {
                sampleItems.push({
                    food_category: sample[`food_category_${idx}`] || '',
                    food_type: sample[`sample_name_${idx}`] || '',
                    oil_type: sample[`oil_type_${idx}`] || '',
                    fry_duration: sample[`fry_duration_${idx}`] || '',
                    fry_count: sample[`fry_count_${idx}`] || '',
                    replacement_type: sample[`replacement_type_${idx}`] || '',
                    replacement_frequency: sample[`replacement_frequency_${idx}`] || ''
                });
            } else {
                sampleItems.push({
                    name: sample[`sample_name_${idx}`] || '',
                    distributor: sample[`distributor_${idx}`] || '',
                    weight: sample[`weight_${idx}`] || '',
                    source: sample[`source_${idx}`] || '',
                });
            }
            idx++;
        }

        // Fallback: if old single-entry style
        if (sampleItems.length === 0) {
            sampleItems.push({
                name: sample.sample_name || '',
                distributor: sample.distributor || '',
                weight: '',
                source: sample.source || '',
            });
        }

        // Ensure at least 5 rows for the table
        while (sampleItems.length < 5) {
            if (sample.form_type === 'MU.10-003') {
                sampleItems.push({ distributor:'', food_type:'', oil_type:'', fry_duration:'', replacement_type:'', last_replacement_date:'', replacement_frequency:'', replacement_reason:'', oil_disposal:'', polar_value:'' });
            } else if (sample.form_type === 'MU.10-004') {
                sampleItems.push({ food_category:'', food_type:'', oil_type:'', fry_duration:'', fry_count:'', replacement_type:'', replacement_frequency:'' });
            } else {
                sampleItems.push({ name:'', distributor:'', weight:'', source:'' });
            }
        }

        // Checkbox Helper for PDF
        const chk = (txt, checked = false) => {
            return `<span style="font-family:'Sarabun', sans-serif;">${checked ? '&#9745;' : '&#9744;'} ${txt}</span>`;
        };

        let tableRows = '';
        sampleItems.forEach((item, i) => {
            if (sample.form_type === 'MU.10-003') {
                const polarNum = parseFloat(item.polar_value);
                let summaryText = '';
                if (!isNaN(polarNum)) {
                    summaryText = polarNum <= 25 ? 'ผ่าน' : 'ไม่ผ่าน';
                }
                
                let formattedDate = item.last_replacement_date || '';
                if (item.last_replacement_date) {
                    try {
                        formattedDate = new Date(item.last_replacement_date).toLocaleDateString('th-TH', {year:'numeric',month:'numeric',day:'numeric'});
                    } catch(e) {}
                }

                tableRows += `
                    <tr style="height: 60px;">
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.distributor ? (i + 1) : ''}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.distributor}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.food_type}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.oil_type}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.fry_duration}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.replacement_type}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${formattedDate}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.replacement_frequency}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.replacement_reason}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.oil_disposal}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; font-weight:bold; border:1px solid #555;">${item.polar_value}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:11px; font-weight:bold; border:1px solid #555;">${summaryText}</td>
                    </tr>
                `;
            } else if (sample.form_type === 'MU.10-004') {
                const showChecked = !!item.food_type;
                const isPassChecked = showChecked && sample.analysis_summary === 'ผ่าน';
                const isFailChecked = showChecked && sample.analysis_summary === 'ไม่ผ่าน';

                tableRows += `
                    <tr style="height: 60px;">
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.food_type ? (i + 1) : ''}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.food_category}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.food_type}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.oil_type}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.fry_duration}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.fry_count}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.replacement_type}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.replacement_frequency}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">
                            ${chk('ผ่าน', isPassChecked)} &nbsp;
                            ${chk('ไม่ผ่าน', isFailChecked)}
                        </td>
                    </tr>
                `;
            } else {
                const showChecked = !!item.name;
                let checkboxCell = '';
                let interpretCell = '';
                let resultCell = '';
                let summaryCell = '';

                if (sample.form_type === 'MU.10-002') {
                    const isBoraxChecked = showChecked && (sample.test_borax === 'on' || sample.test_borax === 'บอแรกซ์' || sample.test_borax === true);
                    const isFormalinChecked = showChecked && (sample.test_formalin === 'on' || sample.test_formalin === 'ฟอร์มาลิน' || sample.test_formalin === true);
                    const isBleachChecked = showChecked && (sample.test_bleach === 'on' || sample.test_bleach === 'ฟอกขาว' || sample.test_bleach === true);
                    const isSalicylicChecked = showChecked && (sample.test_salicylic === 'on' || sample.test_salicylic === 'กันรา (ซาลิซิลิค)' || sample.test_salicylic === true);
                    const isAgonistChecked = showChecked && (sample.test_agonist === 'on' || sample.test_agonist === 'สารเร่งเนื้อแดง' || sample.test_agonist === true);

                    checkboxCell = `
                        <div style="font-size:9px; line-height:1.4;">
                            <div>${chk('สารบอแรกซ์', isBoraxChecked)}</div>
                            <div>${chk('สารฟอร์มาลิน', isFormalinChecked)}</div>
                            <div>${chk('สารฟอกขาว', isBleachChecked)}</div>
                            <div>${chk('สารกันรา (กรดซาลิซิลิค)', isSalicylicChecked)}</div>
                            <div>${chk('สารเร่งเนื้อแดง', isAgonistChecked)}</div>
                        </div>`;

                    interpretCell = `
                        <div style="font-size:8px; line-height:1.3;">
                            <div>${chk('ส้ม')}  ${chk('ส้มแสด')}  ${chk('ส้มแดง')}</div>
                            <div>${chk('ชมพู')}  ${chk('ส้มแดง')}  ${chk('ไม่มีสี')}  ${chk('สีเหลือง')}</div>
                            <div>${chk('ตะกอนสีเทาดำ')}  ${chk('สีดำ')}  ${chk('ไม่มีสี')}</div>
                            <div>${chk('สีม่วงดำ')}  ${chk('สีเหลือง')}  ${chk('สีเขียว')}</div>
                            <div>${chk('1 ขีด (Control)')}  ${chk('2 ขีด (Control+Test) (Test)')}</div>
                        </div>`;

                    resultCell = `
                        <div style="font-size:9px; line-height:1.6;">
                            <div>${chk('ไม่พบ')}</div>
                            <div>${chk('พบ')}</div>
                        </div>`;
                } else {
                    const isGtChecked = showChecked && (sample.test_gt_kit === 'on' || sample.test_gt_kit === 'ยาฆ่าแมลง (GT Kit)' || sample.test_gt_kit === true);
                    const isTmChecked = showChecked && (sample.test_tm_kit === 'on' || sample.test_tm_kit === 'ยาฆ่าแมลง (TM/2 Kit)' || sample.test_tm_kit === true);

                    checkboxCell = `
                        <div style="font-size:8px; line-height:1.1;">
                            <div>${chk('ยาฆ่าแมลง (GT Kit)', isGtChecked)}</div>
                            <div style="margin-top:2px;">${chk('ยาฆ่าแมลง (TM/2 Kit)', isTmChecked)}</div>
                        </div>`;

                    interpretCell = `
                        <div style="font-size:8px; line-height:1.1;">
                            <div>${chk('สีตัวอย่าง = สีควบคุม')}</div>
                            <div style="margin-top:2px;">${chk('สีควบคุม > สีตัวอย่าง < สีตัดสิน')}</div>
                            <div style="margin-top:2px;">${chk('สีตัวอย่าง >= สีตัดสิน')}</div>
                            <div style="margin-top:2px;">${chk('พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ')}</div>
                            <div style="margin-top:2px;">${chk('ไม่พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ')}</div>
                        </div>`;

                    resultCell = `
                        <div style="font-size:8px; line-height:1.1;">
                            <div>${chk('ไม่พบ')}</div>
                            <div style="margin-top:2px;">${chk('พบ')}</div>
                            <div style="margin-top:2px;">${chk('พบปลอดภัย')}</div>
                            <div style="margin-top:2px;">${chk('พบอันตราย')}</div>
                        </div>`;
                }

                const isPassChecked = showChecked && sample.analysis_summary === 'ผ่าน';
                const isFailChecked = showChecked && sample.analysis_summary === 'ไม่ผ่าน';
                summaryCell = `
                    <div style="font-size:8.5px; line-height:1.2;">
                        <div>${chk('ผ่าน', isPassChecked)}</div>
                        <div style="margin-top:2px;">${chk('ไม่ผ่าน', isFailChecked)}</div>
                    </div>`;

                tableRows += `
                    <tr style="height: 48px;">
                        <td style="padding:2px 3px; text-align:center; vertical-align:top; font-size:10.5px; border:1px solid #555;">${item.name ? (i + 1) : ''}</td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9.5px; border:1px solid #555;">${item.distributor}</td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9.5px; border:1px solid #555;"></td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9.5px; border:1px solid #555;">${item.name}</td>
                        <td style="padding:2px 3px; text-align:center; vertical-align:top; font-size:9.5px; border:1px solid #555;">${item.weight}</td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9.5px; border:1px solid #555;">${item.source}</td>
                        <td style="padding:2px 3px; vertical-align:top; border:1px solid #555;">${checkboxCell}</td>
                        <td style="padding:2px 3px; vertical-align:top; border:1px solid #555;">${interpretCell}</td>
                        <td style="padding:2px 3px; vertical-align:top; border:1px solid #555;">${resultCell}</td>
                        <td style="padding:2px 3px; vertical-align:top; border:1px solid #555;">${summaryCell}</td>
                    </tr>
                `;
            }
        });

        const samplingDate = sample.sampling_date ? new Date(sample.sampling_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric'}) : '';
        const logoBase64 = "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";

        let mainTableHTML = '';
        if (sample.form_type === 'MU.10-003') {
            mainTableHTML = `
                <table style="width:85%; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:10px;" border="1">
                    <thead>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle;">
                            <th style="padding:5px 3px; border:1px solid #555; width:3%;">ลำดับ</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:15%;">ชื่อผู้จำหน่าย</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:13%;">ชนิดอาหาร</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">ชนิดน้ำมัน</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:8%;">เวลาทอด<br>(นาที)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">ลักษณะ<br>การเปลี่ยน</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">เปลี่ยนล่าสุด</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:8%;">ความถี่<br>(วัน/ครั้ง)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">เหตุผลที่เปลี่ยน</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">การกำจัดน้ำมัน</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:5%;">โพลาร์<br>(%)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:8%;">สรุปผล</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        } else if (sample.form_type === 'MU.10-004') {
            mainTableHTML = `
                <table style="width:85%; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:10px;" border="1">
                    <thead>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle;">
                            <th style="padding:5px 3px; border:1px solid #555; width:4%;">ลำดับ</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:15%;">ประเภทอาหาร</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:15%;">ระบุชนิดอาหาร</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:12%;">ชนิดน้ำมัน</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">ระยะเวลาใช้ทอด<br>(นาที/ครั้ง)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">จำนวนครั้งที่ทอด<br>(ครั้ง/วัน)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:12%;">ลักษณะการเปลี่ยนน้ำมัน</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">ความถี่ (วัน)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:12%;">ผลการตรวจ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        } else {
            mainTableHTML = `
                <table style="width:85%; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:10px;" border="1">
                    <thead>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle;">
                            <th style="padding:5px 3px; border:1px solid #555; width:4%;">ลำดับ</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">ชื่อผู้จำหน่าย</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:8%;">รหัสตัวอย่าง<br><span style="font-weight:normal;font-size:9px;">(สำหรับผู้ตรวจ<br>วิเคราะห์)</span></th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">ชื่อตัวอย่าง</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:7%;">ปริมาณ<br>ตัวอย่าง<br>(กรัม)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:9%;">แหล่งที่มา</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:14%;">สารที่ตรวจวิเคราะห์</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:18%;">การแปลผล</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:11%;">ผลการตรวจ<br>วิเคราะห์</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:9%;">สรุปผล</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        }

        const htmlContent = `
        <div style="font-family: 'Sarabun', 'TH Sarabun New', sans-serif; width: 100%; padding: 4mm 4mm 4mm 200px; font-size: 10.5px; color: #1a1a1a; box-sizing: border-box; background: #fff; display: block; position: relative; margin: 0;">

            <!-- HEADER -->
            <table style="width:85%; margin:0 0 5px 0; border-collapse:collapse; border: 1.5px solid #333;">
                <tr>
                    <td style="width:70px; padding:6px; text-align:center; border-right:1px solid #aaa; vertical-align:middle;">
                        <img src="data:image/jpeg;base64,${logoBase64}" style="display:block; margin:auto; width:52px; height:auto;">
                    </td>
                    <td style="padding:6px 12px; vertical-align:middle; line-height:1.8; color:#000;">
                        <div><strong>ประเภทเอกสาร : แบบบันทึก</strong></div>
                        <div><strong>ชื่อเอกสาร : <span>${documentName}</span></strong></div>
                        <div><strong>วันที่เริ่มใช้ :</strong> 1 ตุลาคม 2567</div>
                        <div><strong>แผนก :</strong> ห้องปฏิบัติการหน่วยเคลื่อนที่เพื่อความปลอดภัยด้านอาหาร เขตสุขภาพที่ 10</div>
                    </td>
                    <td style="width:160px; padding:6px 12px; border-left:1px solid #aaa; vertical-align:middle; text-align:left; color:#000;">
                        <div style="font-size:12px;"><strong>หมายเลขเอกสาร :</strong> <span>${documentNum}</span></div>
                        <div style="margin-top:6px; font-size:12px;"><strong>แก้ไขครั้งที่ :</strong> <span>002</span></div>
                    </td>
                </tr>
            </table>

            <!-- META FIELDS -->
            <table style="width:85%; margin:0 0 4px 0; border-collapse:collapse; color:#000;">
                <tr>
                    <td style="width:50%; padding:2px 0;">หน่วยงานที่เก็บตัวอย่าง ....<u>${sample.agency || ''}</u>....</td>
                    <td style="padding:2px 0;">สถานที่เก็บตัวอย่าง ....<u>${sample.location_name || ''}</u>....</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:2px 0;">
                        ตำบล ....<u>${sample.tambon || ''}</u>....
                        อำเภอ ....<u>${sample.amphoe || ''}</u>....
                        จังหวัด ....<u>${sample.province || ''}</u>....
                        วันที่เก็บตัวอย่าง ....<u>${samplingDate}</u>....
                    </td>
                </tr>
            </table>

            <!-- MAIN TABLE -->
            ${mainTableHTML}

            <!-- FOOTER SIGNATURES -->
            <table style="width:85%; margin:10px 0 0 0; border-collapse:collapse; font-size:9.5px; color: #000;">
                <tr>
                    <td style="width:33%; vertical-align:top; padding-right:10px;">
                        <div>ลงชื่อผู้เก็บตัวอย่าง ................................................</div>
                        <div style="margin-top:6px;">ตำแหน่ง ........................................................</div>
                        <div style="margin-top:6px;">วันที่เก็บตัวอย่าง ............................................</div>
                    </td>
                    <td style="width:33%; vertical-align:top; text-align:center; padding:0 10px;">
                        <div>ลงชื่อผู้ตรวจวิเคราะห์ ..............................................</div>
                        <div style="margin-top:6px;">ตำแหน่ง ........................................................</div>
                        <div style="margin-top:6px;">วันที่ตรวจวิเคราะห์ ............................................</div>
                    </td>
                    <td style="width:33%; vertical-align:top; text-align:right;">
                        <div>ลงชื่อผู้ทบทวนเอกสาร ................................................</div>
                        <div style="margin-top:6px;">ตำแหน่ง พนง. ห้องปฏิบัติการหน่วยเคลื่อนที่ฯ เขตสุขภาพที่ 10</div>
                        <div style="margin-top:6px;">วันที่ทบทวนเอกสาร ............................................</div>
                    </td>
                </tr>
            </table>
        </div>`;

        const opt = {
            margin: [6, 10, 6, 10],
            filename: `${sample.form_type}_${sample.ref_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: false, 
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1400
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        Swal.fire({
            title: 'กำลังสร้าง PDF...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Generate PDF directly from the HTML string
        setTimeout(() => {
            html2pdf().set(opt).from(htmlContent).save().then(function() {
                Swal.close();
            }).catch(function(err) {
                console.error('PDF generation error:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'PDF Generation Error',
                    text: err.message || err.toString()
                });
            });
        }, 500);
        } catch (syncErr) {
            console.error('PDF sync error:', syncErr);
            Swal.fire({
                icon: 'error',
                title: 'PDF Sync Error',
                text: syncErr.message || syncErr.toString()
            });
        }
    },
    // E-Tracking
    handleTrackingSearch() {
        const query = document.getElementById('trackingSearchInput').value.trim().toUpperCase();
        if(!query) return;

        const sample = this.samples.find(s => s.ref_id.toUpperCase() === query || (s.lab_id && s.lab_id.toUpperCase() === query));
        
        if(!sample) {
            Swal.fire('ไม่พบข้อมูล', 'ไม่พบรหัสตัวอย่างดังกล่าวในระบบ', 'warning');
            document.getElementById('trackingResultWrapper').classList.add('hidden');
            return;
        }

        document.getElementById('trackingResultWrapper').classList.remove('hidden');
        document.getElementById('track-sample-id').innerText = `รหัส: ${sample.lab_id || sample.ref_id}`;
        document.getElementById('track-sample-name').innerText = sample.sample_name;
        document.getElementById('track-form-type').innerText = sample.form_type;
        document.getElementById('track-location').innerText = `${sample.location_name} จ.${sample.province}`;
        document.getElementById('track-collector').innerText = sample.collector_name;

        // Reset Timeline
        document.querySelectorAll('.timeline-step').forEach(el => {
            el.classList.remove('completed', 'current');
        });
        document.querySelectorAll('.timeline-line').forEach(el => el.classList.remove('active'));
        
        const badge = document.getElementById('track-current-status-badge');
        document.getElementById('trackingCertDownloadBar').classList.add('hidden');

        // Update Timeline Steps
        const steps = ['registered', 'accepted', 'analyzing', 'summarized', 'approved'];
        let currentStepIndex = steps.indexOf(sample.status);
        if(sample.status === 'rejected') {
            badge.className = 'status-badge status-badge-current status-rejected';
            badge.innerText = 'ถูกปฏิเสธการรับตัวอย่าง';
            return;
        }
        
        // Fill timestamps
        document.getElementById('time-registered').innerText = new Date(sample.created_at).toLocaleDateString('th-TH');
        document.getElementById('time-accepted').innerText = sample.lab_receive_date ? new Date(sample.lab_receive_date).toLocaleDateString('th-TH') : '-';
        document.getElementById('time-analyzing').innerText = sample.lab_receive_date ? new Date(sample.lab_receive_date).toLocaleDateString('th-TH') : '-';
        document.getElementById('time-summarized').innerText = sample.analysis_date ? new Date(sample.analysis_date).toLocaleDateString('th-TH') : '-';
        document.getElementById('time-approved').innerText = sample.status === 'approved' ? new Date().toLocaleDateString('th-TH') : '-';

        // Apply classes
        steps.forEach((step, index) => {
            const el = document.getElementById(`step-${step}`);
            if (index < currentStepIndex) {
                el.classList.add('completed');
                if(index < 4) document.querySelectorAll('.timeline-line')[index].classList.add('active');
            } else if (index === currentStepIndex) {
                el.classList.add('current');
            }
        });

        // Update Badge text
        const statusMap = {
            'registered': ['รอตรวจรับ', 'status-registered'],
            'accepted': ['กำลังวิเคราะห์', 'status-analyzing'],
            'summarized': ['รอรับรองผล', 'status-summarized'],
            'approved': ['อนุมัติผลวิเคราะห์เรียบร้อย', 'status-approved']
        };
        badge.innerText = statusMap[sample.status][0];
        badge.className = `status-badge status-badge-current ${statusMap[sample.status][1]}`;

        if(sample.status === 'approved') {
            document.getElementById('trackingCertDownloadBar').classList.remove('hidden');
        }
    },

    // Excel Export Logic
    renderExportTable() {
        const province = document.getElementById('filter-province').value;
        const formType = document.getElementById('filter-form-type').value;
        const status = document.getElementById('filter-status').value;
        const startDate = document.getElementById('filter-start-date').value;
        const endDate = document.getElementById('filter-end-date').value;

        let filtered = this.samples.filter(s => {
            let match = true;
            if(province !== 'ALL' && s.province !== province) match = false;
            if(formType !== 'ALL' && s.form_type !== formType) match = false;
            if(status !== 'ALL' && s.status !== status) match = false;
            if(startDate && new Date(s.sampling_date) < new Date(startDate)) match = false;
            if(endDate && new Date(s.sampling_date) > new Date(endDate)) match = false;
            return match;
        });

        document.getElementById('filtered-count').innerText = filtered.length;
        const tbody = document.getElementById('exportTableBody');
        tbody.innerHTML = '';

        filtered.forEach(s => {
            const tr = document.createElement('tr');
            const statusMap = { 'registered': 'ส่งตัวอย่างแล้ว', 'accepted': 'รับเข้าระบบ', 'summarized': 'วิเคราะห์แล้ว', 'approved': 'อนุมัติ', 'rejected': 'ปฏิเสธ' };
            tr.innerHTML = `
                <td>${s.lab_id || s.ref_id}</td>
                <td>${s.form_type}</td>
                <td>${s.sample_name}</td>
                <td>${s.province}</td>
                <td>${new Date(s.sampling_date).toLocaleDateString('th-TH')}</td>
                <td>${s.analysis_summary || '-'}</td>
                <td><span class="status-badge ${statusMap[s.status] === 'อนุมัติ' ? 'status-approved' : 'status-registered'}">${statusMap[s.status]}</span></td>
            `;
            tbody.appendChild(tr);
        });
        
        // Store filtered for download
        this.currentExportData = filtered;
    },

    downloadExcel() {
        if(!this.currentExportData || this.currentExportData.length === 0) {
            Swal.fire('ไม่มีข้อมูล', 'ไม่มีข้อมูลสำหรับดาวน์โหลด กรุณาปรับตัวกรอง', 'warning');
            return;
        }

        // Map data to Thai headers
        const exportData = this.currentExportData.map(s => ({
            'รหัสอ้างอิง': s.ref_id,
            'รหัสแลป': s.lab_id || '-',
            'ประเภทฟอร์ม': s.form_type,
            'ชื่อตัวอย่าง': s.sample_name,
            'จังหวัด': s.province,
            'สถานที่เก็บ': s.location_name,
            'หน่วยงานที่เก็บ': s.agency,
            'วันที่เก็บ': s.sampling_date,
            'ผู้เก็บ': s.collector_name,
            'สถานะ': s.status,
            'ผลการตรวจวิเคราะห์': s.analysis_details || '-',
            'สรุปผล': s.analysis_summary || '-'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Samples_Data");
        
        XLSX.writeFile(workbook, `SSKMOPH_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
};

// Start the app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
