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
            if (typeof document !== 'undefined' && document.fonts) {
                document.fonts.load('10px SarabunPDF');
                document.fonts.load('bold 10px SarabunPDF');
                console.log("Forced loading of SarabunPDF fonts");
            }
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
                collector_name: 'นายสมคิด สุขใจ', collector_position: 'เจ้าหน้าที่สาธารณสุข', sampling_date: '2026-06-20',
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
                collector_name: 'นางสาวสุดสวย ใจดี', collector_position: 'พยาบาลวิชาชีพ', sampling_date: '2026-06-21',
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
                collector_name: 'นายมานะ อดทน', collector_position: 'เจ้าหน้าที่สาธารณสุข', sampling_date: '2026-06-22',
                sample_name: 'น้ำดื่มบรรจุขวด', sample_qty: 5, distributor: 'โรงงานน้ำดื่ม', source: 'ผลิตเอง',
                status: 'registered', created_at: new Date().toISOString()
            },
             {
                ref_id: 'TEMP-10004', lab_id: 'AMN-2026-0004', form_type: 'MU.10-003',
                agency: 'สสจ.อำนาจเจริญ', location_type: 'ตลาดนัด', location_name: 'ตลาดนัดวันศุกร์',
                province: 'อำนาจเจริญ', amphoe: 'เมือง', tambon: 'บุ่ง',
                collector_name: 'นางสมศรี ใจสู้', collector_position: 'ผู้ประกอบการ', sampling_date: '2026-06-21',
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
                    // Pre-fill collector name and position
                    document.getElementById('field-collector-name').value = this.currentUser.fullname;
                    document.getElementById('field-collector-position').value = this.currentUser.role === 'lab' ? 'เจ้าหน้าที่ห้องปฏิบัติการ' : 'ผู้เก็บตัวอย่าง';
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
            case 'download-results':
                this.renderDownloadTable();
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

    
    renderDownloadTable() {
        const tbody = document.getElementById('downloadTableBody');
        if (!tbody) return;
        const searchInput = document.getElementById('searchDownloadTable');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        const approvedSamples = this.samples.filter(s => s.status === 'approved');
        
        tbody.innerHTML = '';
        
        if(approvedSamples.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 30px; color: #64748b;">ไม่พบรายการที่พร้อมดาวน์โหลด</td></tr>';
            return;
        }

        approvedSamples.forEach(s => {
            if (searchTerm && !`${s.lab_no || s.lab_id} ${s.sample_name}`.toLowerCase().includes(searchTerm)) return;
            
            const sampleNames = [];
            let idx = 1;
            while (s['sample_name_' + idx] !== undefined) {
                if (s['sample_name_' + idx]) sampleNames.push(s['sample_name_' + idx]);
                idx++;
            }
            if (sampleNames.length === 0 && s.sample_name) {
                sampleNames.push(s.sample_name);
            }
            const displayName = sampleNames.join(', ') || '-';

            const summary = s.analysis_summary || 'ผ่านเกณฑ์มาตรฐาน';
            let summaryBadge = '';
            if (summary.includes('ไม่ผ่าน')) {
                summaryBadge = `<span class="badge" style="background:#fee2e2; color:#991b1b;">${summary}</span>`;
            } else {
                summaryBadge = `<span class="badge" style="background:#dcfce7; color:#166534;">${summary}</span>`;
            }

            const actionBtn = `<button class="btn btn-primary btn-text" onclick="app.openCertifyModal('${s.ref_id}', true)"><i class="fa-solid fa-download"></i> ดาวน์โหลดรายงาน PDF</button>`;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.lab_no || s.lab_id}</strong></td>
                <td><span class="badge" style="background:#f1f5f9; color:#475569;">${s.form_type}</span></td>
                <td>${displayName.length > 50 ? displayName.substring(0, 50) + '...' : displayName}</td>
                <td>ดูรายละเอียดในเอกสาร...</td>
                <td>${summaryBadge}</td>
                <td>${s.approver_name || s.sel_approver_1 || '-'}</td>
                <td>${actionBtn}</td>
            `;
            tbody.appendChild(tr);
        });
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
            case 'MU.10-005':
                title = 'แบบบันทึกการเก็บตัวอย่างเกลือบริโภค';
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

    calculateIodateOutcome(input, index) {
        const val = parseFloat(input.value);
        const select = document.querySelector(`select[name="test_outcome_${index}"]`);
        if (!select) return;
        if (isNaN(val)) {
            select.value = "";
        } else if (val >= 20 && val <= 40) {
            select.value = "ผ่าน";
        } else {
            select.value = "ไม่ผ่าน";
        }
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
        } else if (formType === 'MU.10-005') {
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <h4 style="color: var(--primary-light); margin: 0; font-size: 16px;"><i class="fa-solid fa-cookie-bite"></i> รายการตรวจเกลือบริโภค #${this.globalSampleIndex}</h4>
                    <button type="button" class="btn btn-text remove-sample-btn" style="color: #ef4444; padding: 5px; font-weight: 500;" onclick="app.removeGlobalSample(this)"><i class="fa-solid fa-trash"></i> ลบรายการนี้</button>
                </div>
                <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label>1. ชื่อผู้จำหน่าย/ร้านค้า *</label>
                        <input type="text" name="distributor_${this.globalSampleIndex}" required placeholder="ระบุชื่อร้านค้า/ผู้จำหน่าย">
                    </div>
                    <div class="form-group">
                        <label>2. ชื่ออาหาร/ยี่ห้อ *</label>
                        <input type="text" name="sample_name_${this.globalSampleIndex}" required placeholder="ระบุชื่อยี่ห้อเกลือ">
                    </div>
                    <div class="form-group">
                        <label>3. เลขสารบบอาหาร (13 หลัก) *</label>
                        <input type="text" name="food_serial_no_	his.globalSampleIndex}" required placeholder="เช่น 10-1-01234-5-6789">
                    </div>
                    <div class="form-group">
                        <label>4. ชื่อ/ที่อยู่ ผู้ผลิต หรือจัดจำหน่าย *</label>
                        <input type="text" name="manufacturer_info_${this.globalSampleIndex}" required placeholder="ระบุชื่อผู้ผลิตและที่อยู่">
                    </div>
                    <div class="form-group">
                        <label>5. วันผลิต/หมดอายุ *</label>
                        <select name="has_mfg_exp_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือก --</option>
                            <option value="มี">มี</option>
                            <option value="ไม่มี">ไม่มี</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>6. น้ำหนักสุทธิ *</label>
                        <input type="text" name="net_weight_${this.globalSampleIndex}" required placeholder="เช่น 500 กรัม">
                    </div>
                    <div class="form-group">
                        <label>7. ข้อความ 'ควรเก็บในที่ร่มและแห้ง' *</label>
                        <select name="has_storage_warning_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือก --</option>
                            <option value="มี">มี</option>
                            <option value="ไม่มี">ไม่มี</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>8. สรุปผลตรวจฉลาก *</label>
                        <select name="label_summary_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือก --</option>
                            <option value="ผ่าน">ผ่าน</option>
                            <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>9. ค่าไอโอเดท (ppm) *</label>
                        <input type="number" step="0.1" name="iodate_value_${this.globalSampleIndex}" required placeholder="ระบุค่า ppm" oninput="app.calculateIodateOutcome(this, ${this.globalSampleIndex})">
                    </div>
                    <div class="form-group">
                        <label>10. สรุปผลตรวจปริมาณ *</label>
                        <select name="test_outcome_${this.globalSampleIndex}" required style="width: 100%; height: 42px; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background-color: white; font-family: inherit; font-size: 14px;">
                            <option value="">-- เลือก --</option>
                            <option value="ผ่าน">ผ่าน (20-40 ppm)</option>
                            <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                        </select>
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
                        key.startsWith('oil_disposal_') || key.startsWith('polar_value_') || key.startsWith('food_category_') ||
                        key.startsWith('food_serial_no_') || key.startsWith('manufacturer_info_') || key.startsWith('has_mfg_exp_') ||
                        key.startsWith('net_weight_') || key.startsWith('has_storage_warning_') || key.startsWith('label_summary_') ||
                        key.startsWith('iodate_value_') || key.startsWith('test_outcome_')) {
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
        document.getElementById('field-collector-position').value = sample.collector_position || '';
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
                    <button class="btn btn-primary btn-text" onclick="app.openSampleDetailPreview('${s.ref_id}')"><i class="fa-solid fa-eye"></i> ดูรายละเอียด</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        if (tbody.innerHTML === '') {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">ไม่มีรายการที่รอตรวจสอบ</td></tr>';
        }
    },

    // Sample Detail Preview (before Accept/Reject)
    openSampleDetailPreview(refId) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if (!sample) return;
        
        this._previewRefId = refId;
        
        // Collect sample items
        const sampleItems = [];
        let idx = 1;
        while (sample[`sample_name_${idx}`] !== undefined) {
            sampleItems.push({
                name: sample[`sample_name_${idx}`] || '',
                distributor: sample[`distributor_${idx}`] || '',
                weight: sample[`weight_${idx}`] || '',
                source: sample[`source_${idx}`] || ''
            });
            idx++;
        }
        
        const samplingDate = sample.sampling_date 
            ? new Date(sample.sampling_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' }) 
            : '-';
        const createdDate = sample.created_at 
            ? new Date(sample.created_at).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) 
            : '-';
        
        // Build sample items table
        let sampleItemsHTML = '';
        if (sampleItems.length > 0 && sampleItems.some(item => item.name)) {
            sampleItemsHTML = `
                <div style="margin-top:16px;">
                    <h5 style="margin:0 0 8px 0; color:#1e3a5f; font-size:14px;"><i class="fa-solid fa-list-check"></i> รายการตัวอย่าง (${sampleItems.filter(i => i.name).length} รายการ)</h5>
                    <table style="width:100%; border-collapse:collapse; font-size:13px;">
                        <thead>
                            <tr style="background:#f1f5f9;">
                                <th style="padding:8px; border:1px solid #e2e8f0; text-align:center; width:40px;">#</th>
                                <th style="padding:8px; border:1px solid #e2e8f0;">ชื่อตัวอย่าง</th>
                                <th style="padding:8px; border:1px solid #e2e8f0;">ผู้จำหน่าย</th>
                                <th style="padding:8px; border:1px solid #e2e8f0; text-align:center;">น้ำหนัก(กรัม)</th>
                                <th style="padding:8px; border:1px solid #e2e8f0;">แหล่งที่มา</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sampleItems.filter(i => i.name).map((item, i) => `
                                <tr>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; text-align:center;">${i+1}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; font-weight:500;">${item.name}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0;">${item.distributor || '-'}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; text-align:center;">${item.weight || '-'}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0;">${item.source || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
        
        const detailHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; font-size:13.5px; color:#333;">
                <div style="grid-column: span 2; background: linear-gradient(135deg, #eff6ff, #dbeafe); padding:12px 16px; border-radius:8px; border-left: 4px solid #2563eb;">
                    <div style="font-size:11px; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px;">รหัสอ้างอิง</div>
                    <div style="font-size:18px; font-weight:700; color:#1e3a5f; margin-top:2px;">${sample.ref_id}</div>
                </div>
                
                <div><span style="color:#6b7280; font-size:12px;">ประเภทแบบฟอร์ม</span><br><strong>${sample.form_type || '-'}</strong></div>
                <div><span style="color:#6b7280; font-size:12px;">วันที่ส่งตัวอย่าง</span><br><strong>${createdDate}</strong></div>
                
                <div><span style="color:#6b7280; font-size:12px;">หน่วยงานที่เก็บ</span><br><strong>${sample.agency || '-'}</strong></div>
                <div><span style="color:#6b7280; font-size:12px;">ผู้เก็บตัวอย่าง</span><br><strong>${sample.collector_name || '-'}</strong></div>
                
                <div><span style="color:#6b7280; font-size:12px;">ตำแหน่ง</span><br><strong>${sample.collector_position || '-'}</strong></div>
                <div><span style="color:#6b7280; font-size:12px;">วันที่เก็บตัวอย่าง</span><br><strong>${samplingDate}</strong></div>
                
                <div style="grid-column: span 2; border-top:1px solid #e5e7eb; padding-top:10px; margin-top:2px;"></div>
                
                <div><span style="color:#6b7280; font-size:12px;">ประเภทสถานที่</span><br><strong>${sample.location_type || '-'}</strong></div>
                <div><span style="color:#6b7280; font-size:12px;">ชื่อสถานที่เก็บ</span><br><strong>${sample.location_name || '-'}</strong></div>
                
                <div><span style="color:#6b7280; font-size:12px;">จังหวัด</span><br><strong>${sample.province || '-'}</strong></div>
                <div><span style="color:#6b7280; font-size:12px;">อำเภอ / ตำบล</span><br><strong>${sample.amphoe || '-'} / ${sample.tambon || '-'}</strong></div>
            </div>
            ${sampleItemsHTML}
        `;
        
        document.getElementById('sampleDetailPreviewContent').innerHTML = detailHTML;
        document.getElementById('sampleDetailPreviewModal').classList.add('active');
    },

    closeSampleDetailPreview() {
        document.getElementById('sampleDetailPreviewModal').classList.remove('active');
        this._previewRefId = null;
    },

    proceedToAcceptFromPreview() {
        const refId = this._previewRefId;
        this.closeSampleDetailPreview();
        if (refId) this.openVerifyAcceptModal(refId);
    },

    proceedToRejectFromPreview() {
        const refId = this._previewRefId;
        this.closeSampleDetailPreview();
        if (refId) this.openVerifyRejectModal(refId);
    },

    openVerifyAcceptModal(refId) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if(!sample) return;
        
        document.getElementById('accept-sample-ref-id').value = sample.ref_id;
        document.getElementById('accept-sample-ref-display').value = sample.ref_id;
        document.getElementById('accept-sample-name-display').value = sample.sample_name;
        
        // Generate auto E-Tracking ID
        const year = new Date().getFullYear() + 543; // Thai year
        const prefix = this.getProvincePrefix(sample.province);
        const count = this.samples.filter(s => s.lab_id && s.lab_id.startsWith(prefix)).length + 1;
        document.getElementById('accept-lab-id').value = `${prefix}-${year}-${String(count).padStart(4, '0')}`;
        
        // Generate auto Lab No (e.g. 0001) accounting for multiple items in previous samples
        let maxLabNo = 0;
        this.samples.forEach(s => {
            let baseNo = parseInt(s.lab_no, 10);
            if (!isNaN(baseNo) && baseNo > 0) {
                let itemCount = 0;
                let i = 1;
                while (s[`sample_name_${i}`] !== undefined) {
                    if (s[`sample_name_${i}`]) itemCount++;
                    i++;
                }
                if (itemCount === 0) itemCount = 1;
                let maxForThisSample = baseNo + itemCount - 1;
                if (maxForThisSample > maxLabNo) {
                    maxLabNo = maxForThisSample;
                }
            }
        });
        document.getElementById('accept-lab-no').value = String(maxLabNo + 1).padStart(4, '0');
        
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
        const labNo = document.getElementById('accept-lab-no').value;
        
        const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
        if (sampleIndex > -1) {
            this.samples[sampleIndex].status = 'accepted';
            this.samples[sampleIndex].lab_id = labId;
            this.samples[sampleIndex].lab_no = labNo;
            this.samples[sampleIndex].lab_receive_date = document.getElementById('accept-receive-date').value;
            this.saveSamples();
            
            Swal.fire('สำเร็จ', `รับตัวอย่างเข้าระบบเรียบร้อย<br>รหัสแลป: ${labNo}`, 'success');
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
            if (searchTerm && !`${s.lab_no || s.lab_id} ${s.sample_name}`.toLowerCase().includes(searchTerm)) return;
            
            const tr = document.createElement('tr');
            const statusBadge = s.status === 'accepted' 
                ? '<span class="status-badge status-analyzing">กำลังวิเคราะห์</span>'
                : '<span class="status-badge status-summarized">สรุปผลแล้ว</span>';
                
            tr.innerHTML = `
                <td><strong>${s.lab_no || s.lab_id}</strong></td>
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
        document.getElementById('analysis-lab-id-display').value = sample.lab_no || sample.lab_id;
        document.getElementById('analysis-form-type-display').value = sample.form_type || '-';
        
        // Auto-populate ชื่อตัวอย่าง จากข้อมูลแบบฟอร์ม
        const sampleNames = [];
        let idx = 1;
        while (sample[`sample_name_${idx}`] !== undefined) {
            if (sample[`sample_name_${idx}`]) sampleNames.push(sample[`sample_name_${idx}`]);
            idx++;
        }
        if (sampleNames.length === 0 && sample.sample_name) {
            sampleNames.push(sample.sample_name);
        }
        document.getElementById('analysis-sample-name-display').value = sampleNames.join(', ') || '-';
        
        // Auto-populate แหล่งที่มา จากข้อมูลแบบฟอร์ม
        const sources = [];
        idx = 1;
        while (sample[`sample_name_${idx}`] !== undefined) {
            const src = sample[`source_${idx}`] || '';
            const dist = sample[`distributor_${idx}`] || '';
            if (src || dist) {
                sources.push([dist, src].filter(Boolean).join(' / '));
            }
            idx++;
        }
        if (sources.length === 0) {
            const parts = [];
            if (sample.distributor) parts.push(sample.distributor);
            if (sample.source) parts.push(sample.source);
            if (sample.location_name) parts.push(sample.location_name);
            if (sample.province) parts.push(`จ.${sample.province}`);
            if (parts.length > 0) sources.push(parts.join(', '));
        }
        document.getElementById('analysis-source-display').value = sources.join('; ') || '-';
        
        // Pre-fill analyst & date
        document.getElementById('analysis-analyst').value = sample.analysis_analyst || this.currentUser.fullname;
        document.getElementById('analysis-date').value = sample.analysis_date || new Date().toISOString().split('T')[0];
        
        // Render dynamic section based on form type
        this.renderAnalysisDynamicSection(sample);
        
        document.getElementById('analysisInputModal').classList.add('active');
    },

    
    handleInterpretationChange(idx) {
        const interpretationMap = {
            'สีตัวอย่าง = สีควบคุม':              { result: 'ไม่พบ',      summary: 'ผ่านเกณฑ์มาตรฐาน' },
            'สีควบคุม>สีตัวอย่าง<สีตัดสิน':       { result: 'พบปลอดภัย',  summary: 'ผ่านเกณฑ์มาตรฐาน' },
            'สีตัวอย่าง ≥ สีตัดสิน':              { result: 'พบอันตราย',  summary: 'ไม่ผ่านเกณฑ์มาตรฐาน' },
            'พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ':    { result: 'พบ',         summary: 'ไม่ผ่านเกณฑ์มาตรฐาน' },
            'ไม่พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ': { result: 'ไม่พบ',      summary: 'ผ่านเกณฑ์มาตรฐาน' }
        };
        const el = document.getElementById('analysis-interpretation-' + idx);
        const resultInput = document.getElementById('analysis-detail-results-' + idx);
        const summaryInput = document.getElementById('analysis-summary-outcome-' + idx);
        if(!el || !resultInput || !summaryInput) return;
        
        const mapped = interpretationMap[el.value];
        if (mapped) {
            resultInput.value = mapped.result;
            summaryInput.value = mapped.summary;
            if (mapped.summary === 'ผ่านเกณฑ์มาตรฐาน') {
                resultInput.style.color = '#16a34a';
                resultInput.style.background = '#f0fdf4';
                summaryInput.style.color = '#16a34a';
                summaryInput.style.background = '#f0fdf4';
            } else {
                resultInput.style.color = '#dc2626';
                resultInput.style.background = '#fef2f2';
                summaryInput.style.color = '#dc2626';
                summaryInput.style.background = '#fef2f2';
            }
        } else {
            resultInput.value = '';
            summaryInput.value = '';
            resultInput.style.color = '';
            resultInput.style.background = '';
            summaryInput.style.color = '';
            summaryInput.style.background = '';
        }
    },
    
    renderAnalysisDynamicSection(sample) {
        const container = document.getElementById('analysis-dynamic-section');
        
        if (sample.form_type === 'MU.10-001') {
            const sampleNames = [];
            let idx = 1;
            while (sample['sample_name_' + idx] !== undefined) {
                if (sample['sample_name_' + idx]) sampleNames.push({ name: sample['sample_name_' + idx], idx: idx });
                idx++;
            }
            if (sampleNames.length === 0) {
                sampleNames.push({ name: sample.sample_name || 'ตัวอย่างที่ 1', idx: 1 });
            }

            let html = '<div class="form-section-divider"><i class="fa-solid fa-microscope"></i> ผลการตรวจวิเคราะห์ (' + sample.form_type + ')</div>';

            sampleNames.forEach(item => {
                html += `
                    <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:15px;">
                        <h5 style="margin-top:0; color:#0f172a; font-weight:bold; border-bottom:1px solid #cbd5e1; padding-bottom:8px; margin-bottom:12px;">ตัวอย่าง: ${item.name}</h5>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>สารที่ตรวจวิเคราะห์ <span class="required">*</span></label>
                                <select id="analysis-substance-${item.idx}" required>
                                    <option value="">-- เลือกสารที่ตรวจ --</option>
                                    <option value="GT">GT</option>
                                    <option value="TM/2">TM/2</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>การแปลผล <span class="required">*</span></label>
                                <select id="analysis-interpretation-${item.idx}" required onchange="app.handleInterpretationChange(${item.idx})">
                                    <option value="">-- เลือกการแปลผล --</option>
                                    <option value="สีตัวอย่าง = สีควบคุม">สีตัวอย่าง = สีควบคุม</option>
                                    <option value="สีควบคุม>สีตัวอย่าง<สีตัดสิน">สีควบคุม > สีตัวอย่าง < สีตัดสิน</option>
                                    <option value="สีตัวอย่าง ≥ สีตัดสิน">สีตัวอย่าง ≥ สีตัดสิน</option>
                                    <option value="พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ">พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ</option>
                                    <option value="ไม่พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ">ไม่พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>ผลการตรวจวิเคราะห์</label>
                                <input type="text" id="analysis-detail-results-${item.idx}" readonly class="readonly-input" style="font-weight:600;">
                                <span class="input-helper">เติมอัตโนมัติจากการแปลผล</span>
                            </div>
                            <div class="form-group">
                                <label>สรุปผล</label>
                                <input type="text" id="analysis-summary-outcome-${item.idx}" readonly class="readonly-input" style="font-weight:700; font-size:14px;">
                                <span class="input-helper">คำนวณอัตโนมัติจากการแปลผล</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                <div class="form-group">
                    <label for="analysis-comment">หมายเหตุเพิ่มเติม</label>
                    <input type="text" id="analysis-comment" placeholder="คำชี้แจงเพิ่มเติมถ้ามี">
                </div>
            `;
            container.innerHTML = html;

            // Pre-fill saved values
            sampleNames.forEach(item => {
                const sub = sample['analysis_substance_' + item.idx] || sample.analysis_substance;
                if (sub) document.getElementById('analysis-substance-' + item.idx).value = sub;
                
                const interp = sample['analysis_interpretation_' + item.idx] || sample.analysis_interpretation;
                if (interp) {
                    const el = document.getElementById('analysis-interpretation-' + item.idx);
                    if (el) {
                        el.value = interp;
                        // Trigger manual change
                        app.handleInterpretationChange(item.idx);
                    }
                }
            });

            if (sample.analysis_comment) document.getElementById('analysis-comment').value = sample.analysis_comment;
            
        } else {
            // Generic form for other form types
            container.innerHTML = `
                <div class="form-section-divider"><i class="fa-solid fa-microscope"></i> ผลการตรวจวิเคราะห์</div>
                <div class="form-group">
                    <label for="analysis-interpretation">การแปลผล <span class="required">*</span></label>
                    <textarea id="analysis-interpretation" rows="2" required placeholder="อธิบายการแปลผลตรวจ เช่น สีที่ปรากฏ, ค่าที่อ่านได้, ขีดบนชุดทดสอบ ฯลฯ"></textarea>
                </div>
                <div class="form-group">
                    <label for="analysis-detail-results">ผลการตรวจวิเคราะห์ <span class="required">*</span></label>
                    <textarea id="analysis-detail-results" rows="3" required placeholder="ตัวอย่างเช่น: ตรวจพบสารฟอร์มาลิน 1.2 ppm หรือ ตรวจไม่พบเชื้อโคลิฟอร์ม"></textarea>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="analysis-summary-outcome">สรุปผล <span class="required">*</span></label>
                        <select id="analysis-summary-outcome" required>
                            <option value="">-- เลือกสรุปผล --</option>
                            <option value="ผ่านเกณฑ์มาตรฐาน">ผ่านเกณฑ์มาตรฐาน</option>
                            <option value="ไม่ผ่านเกณฑ์มาตรฐาน">ไม่ผ่านเกณฑ์มาตรฐาน / ปนเปื้อน</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="analysis-comment">หมายเหตุเพิ่มเติม</label>
                        <input type="text" id="analysis-comment" placeholder="คำชี้แจงเพิ่มเติมถ้ามี">
                    </div>
                </div>
            `;
            
            // Pre-fill saved values
            if (sample.analysis_interpretation) document.getElementById('analysis-interpretation').value = sample.analysis_interpretation;
            if (sample.analysis_details) document.getElementById('analysis-detail-results').value = sample.analysis_details;
            if (sample.analysis_summary) document.getElementById('analysis-summary-outcome').value = sample.analysis_summary;
            if (sample.analysis_comment) document.getElementById('analysis-comment').value = sample.analysis_comment;
        }
    },

    closeAnalysisInputModal() {
        document.getElementById('analysisInputModal').classList.remove('active');
    },

    handleSaveAnalysis(e) {
        e.preventDefault();
        const refId = document.getElementById('analysis-sample-ref-id').value;
        const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
        
        if (sampleIndex > -1) {
            const sample = this.samples[sampleIndex];
            sample.status = 'summarized';
            
            sample.analysis_analyst = document.getElementById('analysis-analyst').value;
            sample.analysis_date = document.getElementById('analysis-date').value;
            
            const interpEl = document.getElementById('analysis-interpretation');
            if(interpEl) sample.analysis_interpretation = interpEl.value;
            
            const detailEl = document.getElementById('analysis-detail-results');
            if(detailEl) sample.analysis_details = detailEl.value;
            
            const summaryEl = document.getElementById('analysis-summary-outcome');
            if(summaryEl) sample.analysis_summary = summaryEl.value;
            
            sample.analysis_comment = document.getElementById('analysis-comment') ? document.getElementById('analysis-comment').value : '';

            
            
            // Save MU.10-001 specific fields
            if (sample.form_type === 'MU.10-001') {
                let passCount = 0;
                let totalCount = 0;
                let idx = 1;
                while (sample['sample_name_' + idx] !== undefined) {
                    if (sample['sample_name_' + idx]) {
                        totalCount++;
                        sample['analysis_substance_' + idx] = document.getElementById('analysis-substance-' + idx)?.value || '';
                        sample['analysis_interpretation_' + idx] = document.getElementById('analysis-interpretation-' + idx)?.value || '';
                        sample['analysis_details_' + idx] = document.getElementById('analysis-detail-results-' + idx)?.value || '';
                        const summary = document.getElementById('analysis-summary-outcome-' + idx)?.value || '';
                        sample['analysis_summary_' + idx] = summary;
                        if (summary === 'ผ่านเกณฑ์มาตรฐาน') passCount++;
                    }
                    idx++;
                }
                if (totalCount === 0) {
                    totalCount = 1;
                    sample['analysis_substance_1'] = document.getElementById('analysis-substance-1')?.value || '';
                    sample['analysis_interpretation_1'] = document.getElementById('analysis-interpretation-1')?.value || '';
                    sample['analysis_details_1'] = document.getElementById('analysis-detail-results-1')?.value || '';
                    const summary = document.getElementById('analysis-summary-outcome-1')?.value || '';
                    sample['analysis_summary_1'] = summary;
                    if (summary === 'ผ่านเกณฑ์มาตรฐาน') passCount++;
                }
                
                // Set overall summary string for table views
                if (passCount === totalCount && totalCount > 0) {
                    sample.analysis_summary = 'ผ่านเกณฑ์มาตรฐาน';
                } else if (passCount === 0) {
                    sample.analysis_summary = 'ไม่ผ่านเกณฑ์มาตรฐาน';
                } else {
                    sample.analysis_summary = `ผ่าน ${passCount} / ไม่ผ่าน ${totalCount - passCount}`;
                }
            }
            
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
        
        const reportSamples = this.samples.filter(s => s.status === 'summarized' || s.status === 'analyst_signed');
        
        tbody.innerHTML = '';
        
        reportSamples.forEach(s => {
            if (searchTerm && !`${s.lab_no || s.lab_id} ${s.sample_name}`.toLowerCase().includes(searchTerm)) return;
            
            const isApproved = s.status === 'approved';
            const actionBtn = isApproved 
        ? `<button class="btn btn-secondary btn-text" onclick="app.openCertifyModal('${s.ref_id}', true)"><i class="fa-solid fa-file-pdf"></i> ดูรายงาน PDF</button>`
        : (s.status === 'summarized' 
            ? `<button class="btn btn-primary btn-text" onclick="app.openCertifyModal('${s.ref_id}')"><i class="fa-solid fa-pen-nib"></i> ลงนามผู้ตรวจ</button>` 
            : `<button class="btn btn-success btn-text" onclick="app.openCertifyModal('${s.ref_id}')"><i class="fa-solid fa-stamp"></i> ลงนามผู้รับรอง</button>`);
        
    const displayStatus = s.status === 'summarized' ? 'รอผู้ตรวจวิเคราะห์และผู้รับรองลงนาม' : (s.status === 'analyst_signed' ? 'รอผู้รับรองลงนาม' : s.analysis_summary);
    const statusClass = s.status === 'summarized' ? 'status-pending' : (s.status === 'analyst_signed' ? 'status-warning' : (s.analysis_summary.includes('ไม่ผ่าน') ? 'status-rejected' : 'status-approved'));
        
    const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.lab_no || s.lab_id}</strong></td>
                <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${s.form_type}</span></td>
                <td>${s.sample_name}</td>
                <td><small>${(s.analysis_details || s.analysis_details_1 || "-").substring(0, 30)}...</small></td>
                <td><span class="status-badge ${statusClass}">${displayStatus}</span></td>
                <td>${s.analysis_analyst}</td>
                <td>${actionBtn}</td>
            `;
            tbody.appendChild(tr);
        });
        
         if (tbody.innerHTML === '') {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">ไม่มีรายงานที่รออนุมัติ</td></tr>';
        }
    },

    openCertifyModal(refId, viewOnly = false, forceEdit = false) {
        const sample = this.samples.find(s => s.ref_id === refId);
        if(!sample) return;
        
        const container = document.getElementById('cert-dynamic-content');
        
        // Define signature html helper
        const getSig = (name) => {
            if(viewOnly || sample.status === 'approved') {
                return name ? `<span style="color: #2563eb; font-style: italic; font-size: 10px;">(ลงนามอิเล็กทรอนิกส์)</span>` : '';
            }
            return `<span class="placeholder-signature">(ลงนามรับรอง)</span>`;
        };

        const getSpecificSig = (fileName, isSelected) => {
            if ((viewOnly || sample.status === 'approved') && isSelected) {
                return `<img src="${fileName}" class="official-signature-img" onerror="this.style.display='none'">`;
            }
            return `<span class="placeholder-signature">(รอลงนามรับรอง)</span>`;
        };

        const PERSON_DATA = {
            'anchasa': {
                name: 'นางสาวอัญชสา ทองสีงามตา',
                title1: 'นักวิชาการสาธารณสุข',
                title2: '',
                sig: `data:image/png;base64,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`
            },
            'surachai': {
                name: 'นายสุรชัย รินทอง',
                title1: 'นักวิชาการสาธารณสุข',
                title2: '',
                sig: `data:image/png;base64,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`
            },
            'thitiporn': {
                name: 'นางสาวฐิติพร อินศร',
                title1: 'เภสัชกรชำนาญการพิเศษ',
                title2: 'หัวหน้าห้องปฏิบัติการ',
                sig: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`
            },
            'mallika': {
                name: 'นางสาวมัลลิกา สุพล',
                title1: 'เภสัชกรชำนาญการพิเศษ',
                title2: 'หัวหน้ากลุ่มงานคุ้มครองผู้บริโภคและเภสัชสาธารณสุข',
                sig: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWAAAAGOCAYAAACpL9m+AAAQAElEQVR4Aey9e3hVVZrnv45datAgEUQOyJ0EuagQKKVAggjegpfW0lA1ZWsJXU9NdfcD09ZvnpkBnX/mKfGZeZ7SaXhmyqrpBrW6qm0oS0uBeINCgiCghIhcE64JEOQmEgQtLX/fz5KTiiEk5yTnss8+Lw8r+5x99l5r7e/a+7ve9X3ftfYFzv4ZAoaAIWAIZAQBI+CMwG6FGgKGgCHgnBGw3QWGgCGQmwgE4KqNgAPQCFYFQ8AQyE0EjIBzs93tqg0BQyAACBgBB6ARrAqGQO4hYFcMAkbAoGDJEDAEDIEMIGAEnAHQrUhDwBAwBEDACBgULBkCuYWAXW1AEDACDkhDWDUMAUMg9xAwAs69NrcrNgQMgYAgYAQckIawauQOAnalhkAMASPgGBK2NQQMAUMgzQgYAacZcCvOEDAEDIEYAkbAMSRsmxsI2FUaAgFCwAg4QI1hVTEEDIHcQsAIOLfa267WEDAEAoSAEXCAGiP8VbErNAQMgaYIGAE3RcM+GwKGgCGQRgSMgNMIthVlCBgChkBTBIyAm6IR7s92dYaAIRAwBIyAA9YgVh1DwBDIHQSMgHOnre1KDQFDIGAIGAGnqUGsGEPAEDAEmiNgBNwcEftuCBgChkCaEDACThPQVowhYAgYAs0RyA0Cbn7V9t0QMAQMgQAgYAQcgEawKhgChkBuImAEnJvtbldtCBgCAUAgDQQcgKu0KhgChoAhEEAEjIAD2ChWJUPAEMgNBIyAc6Od7SoNAUMgAwi0VaQRcFsI2e+GgCFgCKQIASPgFAFr2RoChoAh0BYCRsBtIWS/GwKGQHYikAW1NgLOgkayKhoChkA4ETACDme72lUZAoZAFiBgBJwFjWRVNASyDwGrcTwIGAHHg5IdYwgYAoZAChAwAk4BqJalIWAIGALxIGAEHA9KdowhkF0IWG2zBAEj4CxpKKumIWAIhA8BI+DwtaldkSFgCGQJAkbAWdJQVs3sQcBqagjEi4ARcLxI2XGGgCFgCCQZASPgJANq2RkChoAhEC8CRsDxImXHZQcCVktDIIsQMALOosayqhoChkC4EDACDld72tUYAoZAFiFgBJxFjRX8qloNDQFDIBEEjIATQcuONQQMAUMgiQgYAScRTMvKEDAEDIFEEDACTgStYB9rtWsBgdWrVxeuWrWqdNmyZdNef/31GeXl5bPY8p39+r148+bN+S2carsMgZQjYASccoitgHQisG7duqiItWTJkiWzfvvb36784IMPKt99992la9euna/f5uq3OStXrpz7xz/+cf7y5cuX6vMGbU/+5je/Wco56ayrlWUIGAHbPZDVCMiCLZQ1W/bqq6/OWah/EG5lZeXKqqqqOfpcsmXLlvwdO3a43bt3u71797pdu3a5nTt3upqaGrd161an352OcyLnUsj52WefrSYv8s1qYKzyWYGAEXCSmsmySS8CK1asKH3xxRfnf/jhh+Xvv//+wvXr18967733yrZv3x6trq72hFtXV+c++ugj98knn7jTp0+7zz//vLGSf/7zn91XX33l9504ccIdOHDAE7Ms4kLy2rZt28KlS5fOMCJuhMw+pAABI+AUgGpZpg4BkW3Jyy+/vFDbpZIWpsnaLcTCra2tdUeOHPEJso1EIi4/P99169bN9ejRw3Xt2tV17tzZp29961suLy/PXXLJJY7PF110kevUqZO74IILPFlD4CLe4oqKirmyjiuRJkwndvYvBQhckII8LUtDIKkIQH5Yo+i0a9euXanvZfv27XMff/yx++yzzxzW7F/91V95MoVYIdpoNOoGDBjgrr766sZUWFjoSZlj//SnP7kvv/yysZ6QcEFBgSdmfsNyRqrYsGFDviziORs3blwoiaKk8QT7YAgkAYFwEHASgLAsgomA9N1pIsBKabRz16xZUyoi9Prt0aNHvXyABdulSxfXvXt317t3bwfJDh482A0bNmzRyJEjHy8uLp46evToydrerTRVvx3t16+fg6Ah6jxZwhdeeKG3hq+44gqfD/svvvhiT+yHDx/2OrGkjlLpyP+EZezsnyGQJASMgJMEpGWTXASwNn/961+vFOHNf+eddwpl9TpkhlOnTnnLFckAeQEyxcoVuS769re//cTYsWMh2nFDhw796e233/5ESUnJojFjxiwfN27c4okTJy66/vrrH9G+x5We1+cqCBvyjskRkDEJ+QKLmM/Hjx93yBKSO4oldyykU0ju1VpuuYqAEXCutnxAr1vabiGxulVVVSvlVCvR1jvIcJhBiJdeeqnDUu3fv7+TNeuGDBny/PDhw6dee+21fzdlypTHIVoR7poRI0bUtXSJsoYX33rrrU9897vf/eEN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7a8hQ1seeCzVSCTiQ5twwh0/frxDBPzZZ595AoZ8IRfIF1JRyqk44Kqqqt6vvPLKz0S425cuXfow1u7evXt9HCqYQAhMnpA27kP16LRwuPXv39+vWnb77bfXT548uej++++fahavS+ifHG/Tqquryw4cOODXJInNEJTzbV5CGdnBGUUg1ATcpUuXyi5dujhkAkgYspT1CkF0yAknHbNIOrDXMGk9CAbC4XOupPLy8kdFuLW/+93vHlu8eLF7//33/UplkCwYINEQ8kdipIDUIGcaEym8g+2v//qvp//oRz/qKeLN0QkVoNT+JMt3NmFnrHgG5uA7YMCACmm/tuZD+2FN+5mhJmBZX68p+fAmkCUqgq0sWDbtTiKXfCVP7GQC+V5yySVVfA5zksY7QqT76P/+3//7yMKFC5+CeKVDOqxehsGRSMR74unsGHnErN0xY8Z40r3vvvvq77333in/8A//ELn11lvttTjtvFnUBjO2b99eePjwYX8PstbvddddxzvwTPttJ6aZOi3UBCzrt4LpmJBBJBLxq2lFIhF/03YEcBFMPlY1lgf5YFmLhGv79OkTWg1YUsNjK1as2Pib3/zmKaVu+u4++OADH9XQdARAJ6dhsCsuLnZ33XWX++EPf1g+bdq0Cf/1v/7XyMMPP9xT+qRpvNw07UyrVq0q2bFjx1zedKGRmF/jRE43JwKecP3115vjsp24Zuq0UBOwrLJChsCACzGIOPnoZK36bUf+4FRCA0bSiOXbkfyCei4L5Ujf/dl77733M+mO7t133/XLetKxEbNL58aIAknm8ssvxwpzN954o5O+O+/mm28eNXXq1CmygIPmFAoq3G3WS5LDLCxfyJdRGNavnJnl6tgM4zbRC94BoSZg4MZSZYsOCWnyuaOEyboS3PyxvMlTVnBorN/ly5c/LHnhZ6SVK1dufPnllx+To80R2aBOzS/DSecDnnI84nn3TrW7777bfe9731uAY62srGym9F2zyLg5kpRWr15dKLmnVCTspxwz8oCA1RGa7pskjNOdTegJuCVAsdha2h/vvhiBQ0IiXh9epW0opiFLZiiTtfucnGyPSWZgwZzeFRUVbufOnX4xIzofpBcefkkufrpwaWmpu+eeewglI6JhuojXHGvx3kwJHKc2WMiCRXv27PGL1EO+RUVFRJKYnp4AjkE6NNQEfPHFF9eL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`
            }
        };

        const renderSignatureSlot = (personKey, defaultRole) => {
            if (!personKey || !PERSON_DATA[personKey]) {
                return `
                    <div class="cert-signature-area" style="margin-top: 5px;">
                        <div style="height: 40px; margin-bottom: 5px; position: relative; display: flex; align-items: flex-end; justify-content: center; width: 100%;">
                            <span class="placeholder-signature" style="position: absolute; bottom: 15px;">(รอลงนามรับรอง)</span>
                            <span style="font-size: 11.5px; white-space: nowrap;">ลงชื่อ................................................${defaultRole}</span>
                        </div>
                        <p style="margin-bottom: 2px;">(.......................................)</p>
                        <p>${defaultRole}</p>
                    </div>
                `;
            }
            const p = PERSON_DATA[personKey];
            const sigHtml = (viewOnly || sample.status === 'approved') ? 
                `<img src="${p.sig}" class="official-signature-img" onerror="this.style.display='none'">` : 
                `<span class="placeholder-signature">(รอลงนามรับรอง)</span>`;
            
            return `
                <div class="cert-signature-area" style="margin-top: 5px;">
                    <div style="height: 40px; margin-bottom: 5px; position: relative; display: flex; align-items: flex-end; justify-content: center; width: 100%;">
                        <div style="position: absolute; bottom: 5px; z-index: 10;">${sigHtml}</div>
                        <span style="font-size: 11.5px; white-space: nowrap; position: relative; z-index: 1;">ลงชื่อ................................................${defaultRole}</span>
                    </div>
                    <p style="margin-bottom: 2px;">(${p.name})</p>
                    <p style="margin-bottom: 2px;">${p.title1}</p>
                    ${p.title2 ? `<p>${p.title2}</p>` : ''}
                </div>
            `;
        };

        if (sample.form_type === 'MU.10-001') {
            // --- MU.10-001 Template ---
            let rowsHtml = '';
            let totalCount = 0;
            let passCount = 0;
            
            let idx = 1;
            while (sample[`sample_name_${idx}`] !== undefined) {
                if (sample[`sample_name_${idx}`]) {
                    totalCount++;
                    const isPass = (sample['analysis_summary_' + idx] || sample.analysis_summary) === 'ผ่านเกณฑ์มาตรฐาน';
                    if (isPass) passCount++;
                    const details = sample['analysis_details_' + idx] || sample.analysis_details || '-';
                    
                    rowsHtml += `
                        <tr>
                            <td style="text-align:center;">${totalCount}</td>
                            <td style="text-align:center;">${sample[`distributor_${idx}`] || '-'}</td>
                            <td style="text-align:center;">${sample.lab_no ? String(parseInt(sample.lab_no, 10) + totalCount - 1).padStart(4, '0') : `${sample.lab_id}-${totalCount}`}</td>
                            <td style="text-align:center;">${sample[`sample_name_${idx}`]}</td>
                            <td style="text-align:center;">${sample[`source_${idx}`] || sample.location_name}</td>
                            <td style="text-align:center;">${details}</td>
                            <td style="text-align:center;">${isPass ? 'ผ่าน' : 'ไม่ผ่าน'}</td>
                        </tr>
                    `;
                }
                idx++;
            }
            
            if (totalCount === 0) {
                totalCount = 1;
                const isPass = (sample['analysis_summary_1'] || sample.analysis_summary) === 'ผ่านเกณฑ์มาตรฐาน';
                if (isPass) passCount++;
                const details = sample['analysis_details_1'] || sample.analysis_details || '-';
                rowsHtml += `
                    <tr>
                        <td style="text-align:center;">1</td>
                        <td style="text-align:center;">${sample.distributor || '-'}</td>
                        <td style="text-align:center;">${sample.lab_no || sample.lab_id}</td>
                        <td style="text-align:center;">${sample.sample_name || '-'}</td>
                        <td style="text-align:center;">${sample.source || sample.location_name}</td>
                        <td style="text-align:center;">${details}</td>
                        <td style="text-align:center;">${isPass ? 'ผ่าน' : 'ไม่ผ่าน'}</td>
                    </tr>
                `;
            }
            
            const passPercent = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(0) : 0;
            const receiveDate = new Date(sample.lab_receive_date || sample.created_at).toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'});
            const analysisDate = sample.analysis_date ? new Date(sample.analysis_date).toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'}) : '-';
            
            container.innerHTML = `
                <div style="position: absolute; top: 140px; left: 60px; font-size: 12.5px; color: #1e293b;">
                    RD-001
                </div>
                <div style="position: absolute; top: 140px; right: 60px; font-size: 12.5px; color: #1e293b;">
                    หน้าที่ 1/1
                </div>
                <div class="cert-pdf-header-mu10" style="margin-bottom: 20px;">
                    <h4 style="text-align:center; font-weight:bold; margin-bottom: 25px; font-size: 18px; color: #1e3a8a;">ผลการตรวจวิเคราะห์สารตกค้างยาฆ่าแมลง โดยใช้ชุดทดสอบเบื้องต้น (Test kit)</h4>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size: 14.5px;">
                        <div><strong>สถานที่เก็บตัวอย่าง:</strong> ${sample.location_name} จ.${sample.province}</div>
                    </div>
                    <div style="margin-bottom:8px; font-size: 14.5px;">
                        <strong>วันที่รับตัวอย่าง:</strong> ${receiveDate}
                    </div>
                    <div style="margin-bottom:8px; font-size: 14.5px;">
                        <strong>วันที่ตรวจวิเคราะห์:</strong> ${analysisDate}
                    </div>
                    <div style="margin-bottom:8px; font-size: 14.5px;">
                        <strong>จำนวนตัวอย่างทั้งหมด:</strong> &nbsp;${totalCount} ตัวอย่าง &nbsp;&nbsp;&nbsp; ผ่าน ${passCount} ตัวอย่าง &nbsp;&nbsp;&nbsp; ผ่านร้อยละ ${passPercent}
                    </div>
                </div>
                
                <table class="cert-multi-table">
                    <thead>
                        <tr>
                            <th width="5%">ลำดับ</th>
                            <th width="20%">ชื่อผู้จำหน่าย</th>
                            <th width="15%">รหัสตัวอย่าง</th>
                            <th width="15%">ตัวอย่าง</th>
                            <th width="15%">แหล่งที่มา</th>
                            <th width="15%">${(sample.analysis_substance_1 || sample.analysis_substance) === 'ยาฆ่าแมลง (GT Kit)' ? 'GT' : ((sample.analysis_substance_1 || sample.analysis_substance) === 'ยาฆ่าแมลง (TM/2 Kit)' ? 'TM/2' : (sample.analysis_substance_1 || sample.analysis_substance)) || 'GT'}</th>
                            <th width="15%">สรุปผล</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                
                <div style="margin-top:20px; font-size:11.5px; margin-bottom: 40px; color: #334155;">
                    <p style="margin-bottom:4px;"><strong>หมายเหตุ :</strong> การตรวจสารตกค้างยาฆ่าแมลงในผักผลไม้สด ทำการตรวจสาร 2 กลุ่ม ดังนี้ กลุ่มออร์แกโนฟอสเฟต และคาร์บาเมต (ชุดตรวจ GT-Kit)</p>
                    <p style="margin-bottom:4px;"><strong>การสรุปผล :</strong> - ผ่าน หมายถึง ไม่พบ (Inhibitor 0%), พบปลอดภัย (พบน้อยกว่า Inhibition 50%) อยู่ในเกณฑ์มาตรฐาน (ในระดับปลอดภัย)</p>
                    <p style="margin-left: 65px;">- ไม่ผ่าน หมายถึง พบ : พบในระดับไม่ปลอดภัย (Inhibition มากกว่าหรือเท่ากับ 50%) ไม่อยู่ในเกณฑ์มาตรฐาน</p>
                </div>
                
                <div class="cert-signatures-grid" style="font-size: 11.5px; color: #334155; margin-top: 10px; gap: 15px 40px;">
                    ${renderSignatureSlot(sample.sel_analyst_1, 'ผู้ตรวจวิเคราะห์')}
                    ${renderSignatureSlot(sample.sel_analyst_2, 'ผู้ตรวจวิเคราะห์')}
                    ${renderSignatureSlot(sample.sel_approver_1, 'ผู้รับรอง')}
                    ${renderSignatureSlot(sample.sel_approver_2, 'ผู้รับรอง')}
                </div>
            `;
        } else {
            // --- Legacy Template for other forms ---
            container.innerHTML = `
                <div class="cert-pdf-meta">
                    <p><strong>เลขที่รายงาน:</strong> <span>${sample.lab_no || sample.lab_id}</span></p>
                    <p><strong>วันที่รายงาน:</strong> <span>${new Date().toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'})}</span></p>
                </div>
                <div class="cert-pdf-body">
                    <p>ใบรายงานฉบับนี้ ขอรับรองว่า ตัวอย่างด้านล่างได้รับการตรวจวิเคราะห์โดยหน่วยงานทางห้องปฏิบัติการ:</p>
                    <table class="cert-pdf-table">
                        <tr><td width="30%"><strong>ประเภทตัวอย่าง:</strong></td><td><span>${sample.form_type}</span></td></tr>
                        <tr><td><strong>ชื่อตัวอย่าง:</strong></td><td><span>${sample.sample_name || sample.sample_name_1 || '-'}</span></td></tr>
                        <tr><td><strong>จำนวนตัวอย่าง:</strong></td><td><span>${sample.sample_qty || '1'}</span></td></tr>
                        <tr><td><strong>สถานที่เก็บตัวอย่าง:</strong></td><td><span>${sample.location_name} จ.${sample.province}</span></td></tr>
                        <tr><td><strong>ผู้ส่งตรวจ / หน่วยงาน:</strong></td><td><span>${sample.collector_name} (${sample.agency})</span></td></tr>
                        <tr><td><strong>วันที่ส่งตรวจ:</strong></td><td><span>${new Date(sample.lab_receive_date || sample.created_at).toLocaleDateString('th-TH')}</span></td></tr>
                    </table>
                    <h5 style="margin-top: 20px; font-weight: 600; border-bottom: 2px solid #b45309; padding-bottom: 5px; color: #1e3a8a;">ผลการตรวจวิเคราะห์ทางห้องปฏิบัติการ</h5>
                    <table class="cert-pdf-table">
                        <tr><td width="30%"><strong>ผู้ตรวจวิเคราะห์:</strong></td><td><span>${sample.analysis_analyst || '-'}</span></td></tr>
                        <tr><td><strong>รายละเอียดผลตรวจ:</strong></td><td><span>${sample.analysis_details || '-'}</span></td></tr>
                        <tr><td><strong>สรุปผลการวิเคราะห์:</strong></td><td>
                            <span class="cert-pdf-outcome" style="color:${sample.analysis_summary?.includes('ไม่ผ่าน') ? '#ef4444' : '#10b981'}; border-color:${sample.analysis_summary?.includes('ไม่ผ่าน') ? '#ef4444' : '#10b981'};">${sample.analysis_summary || '-'}</span>
                        </td></tr>
                    </table>
                </div>
                <div class="cert-signatures-grid" style="grid-template-columns: 1fr;">
                    <div class="cert-signature-area" style="margin: 0 auto;">
                        <div class="signature-line">${getSig(sample.approver_name)}</div>
                        <p><strong>${sample.approver_name || '(รอการลงนาม)'}</strong></p>
                        <p>หัวหน้าศูนย์วิทยาศาสตร์การแพทย์</p>
                    </div>
                </div>
            `;
        }

        // Setup Controls
        if(viewOnly || (sample.status === 'approved' && !forceEdit)) {
            document.getElementById('certApprovalControls').classList.add('hidden');
            document.getElementById('certExportControls').classList.remove('hidden');
        } else {
            document.getElementById('certApprovalControls').classList.remove('hidden');
            document.getElementById('certExportControls').classList.add('hidden');
            
            const btnApprove = document.getElementById('btnApproveAndSign');
            if (forceEdit) {
                btnApprove.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึกการเปลี่ยนแปลง';
            } else {
                btnApprove.innerHTML = '<i class="fa-solid fa-stamp"></i> บันทึก';
            }
            
            
            if (sample.form_type === 'MU.10-001') {
                document.getElementById('cert-standard-inputs').style.display = 'none';
                document.getElementById('cert-mu10-signatures').style.display = 'block';
                
                const s1 = document.getElementById('sel-analyst-1');
                const s2 = document.getElementById('sel-analyst-2');
                const s3 = document.getElementById('sel-approver-1');
                const s4 = document.getElementById('sel-approver-2');
                const btnApprove = document.getElementById('btnApproveAndSign');
                
                if (viewOnly) {
                    s1.value = sample.sel_analyst_1 || "";
                    s2.value = sample.sel_analyst_2 || "";
                    s3.value = sample.sel_approver_1 || "";
                    s4.value = sample.sel_approver_2 || "";
                    s1.disabled = true; s2.disabled = true; s3.disabled = true; s4.disabled = true;
                    btnApprove.style.display = 'none';
                } else if (sample.status === 'summarized') {
                    // Part 1: Analyst
                    s1.value = sample.sel_analyst_1 || "anchasa";
                    s2.value = sample.sel_analyst_2 || "surachai";
                    s3.value = "";
                    s4.value = "";
                    s1.disabled = false; s2.disabled = false;
                    s3.disabled = true; s4.disabled = true;
                    btnApprove.innerHTML = '<i class="fa-solid fa-pen-nib"></i> บันทึกลายมือชื่อผู้ตรวจวิเคราะห์';
                    btnApprove.style.display = 'inline-block';
                } else if (sample.status === 'analyst_signed') {
                    // Part 2: Approver
                    s1.value = sample.sel_analyst_1 || "anchasa";
                    s2.value = sample.sel_analyst_2 || "surachai";
                    s3.value = sample.sel_approver_1 || "thitiporn";
                    s4.value = sample.sel_approver_2 || "mallika";
                    s1.disabled = true; s2.disabled = true;
                    s3.disabled = false;
                    s4.disabled = true; // Auto mallika
                    btnApprove.innerHTML = '<i class="fa-solid fa-stamp"></i> บันทึก';
                    btnApprove.style.display = 'inline-block';
                }
            } else {

                document.getElementById('cert-standard-inputs').style.display = 'block';
                if(document.getElementById('cert-mu10-signatures')) document.getElementById('cert-mu10-signatures').style.display = 'none';
                document.getElementById('approve-officer-name').value = this.currentUser.fullname;
            }
            // Attach refId to approve button
            btnApprove.dataset.refId = refId;
        }

        // Ensure refId is always available for edit operations
        document.getElementById('btnApproveAndSign').dataset.refId = refId;

        document.getElementById('certifyModal').classList.add('active');
    },

    enableEditApproval() {
        const refId = document.getElementById('btnApproveAndSign').dataset.refId;
        if(refId) {
            this.openCertifyModal(refId, false, true);
        }
    },

    closeCertifyModal() {
        document.getElementById('certifyModal').classList.remove('active');
    },

    handleApproveReport(e) {
        const refId = e.currentTarget.dataset.refId;
        const sampleIndex = this.samples.findIndex(s => s.ref_id === refId);
        if (sampleIndex === -1) return;
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
    },

    // PDF Generation
    generateCertificatePDF() {
        const element = document.getElementById('certificatePDFContainer');
        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        const currentScrollX = window.scrollX || window.pageXOffset || 0;
        const pdfNoEl = document.getElementById('cert-pdf-no');
        const pdfNo = pdfNoEl ? pdfNoEl.innerText.trim() : new Date().getTime();
        const opt = {
            margin:       10,
            filename:     `Certificate_${pdfNo}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                scrollX: currentScrollX,
                scrollY: currentScrollY
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        Swal.fire({
            title: 'กำลังสร้าง PDF...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        html2pdf().set(opt).from(element).save().then(() => {
            Swal.close();
        }).catch(err => {
            Swal.fire('Error', err.toString(), 'error');
        });
    },

    generateSubmissionPDF(e) {
        try {
            const refId = e.currentTarget.dataset.refId;
            const sample = this.samples.find(s => s.ref_id === refId);
            if(!sample) return;

        // Document Details mapping based on formType
        let documentName = 'แบบบันทึกการสุ่มตัวอย่างอาหาร (กลุ่มผักและผลไม้)';
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
        } else if (sample.form_type === 'MU.10-005') {
            documentName = 'แบบบันทึกการสุ่มตัวอย่างเกลือบริโภค';
            documentNum = 'MU.10-005';
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
            } else if (sample.form_type === 'MU.10-005') {
                sampleItems.push({
                    distributor: sample[`distributor_${idx}`] || '',
                    food_type: sample[`sample_name_${idx}`] || '',
                    food_serial_no: sample[`food_serial_no_${idx}`] || '',
                    manufacturer_info: sample[`manufacturer_info_${idx}`] || '',
                    has_mfg_exp: sample[`has_mfg_exp_${idx}`] || '',
                    net_weight: sample[`net_weight_${idx}`] || '',
                    has_storage_warning: sample[`has_storage_warning_${idx}`] || '',
                    label_summary: sample[`label_summary_${idx}`] || '',
                    iodate_value: sample[`iodate_value_${idx}`] || '',
                    test_outcome: sample[`test_outcome_${idx}`] || ''
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
            } else if (sample.form_type === 'MU.10-005') {
                sampleItems.push({ distributor:'', food_type:'', food_serial_no:'', manufacturer_info:'', has_mfg_exp:'', net_weight:'', has_storage_warning:'', label_summary:'', iodate_value:'', test_outcome:'' });
            } else {
                sampleItems.push({ name:'', distributor:'', weight:'', source:'' });
            }
        }

        // Checkbox Helper for PDF
        const chk = (txt, checked = false) => {
            return `<span style="font-family: 'Tahoma', 'SarabunPDF', sans-serif;">${checked ? '&#9745;' : '&#9744;'} ${txt}</span>`;
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
            } else if (sample.form_type === 'MU.10-005') {
                tableRows += `
                    <tr style="height: 50px;">
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.food_type ? (i + 1) : ''}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.distributor}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.food_type}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.food_serial_no}</td>
                        <td style="padding:4px; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.manufacturer_info}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.has_mfg_exp}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.net_weight}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; border:1px solid #555;">${item.has_storage_warning}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; font-weight:bold; border:1px solid #555;">${item.label_summary}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; font-weight:bold; border:1px solid #555;">${item.iodate_value}</td>
                        <td style="padding:4px; text-align:center; vertical-align:middle; font-size:10px; font-weight:bold; border:1px solid #555;">${item.test_outcome}</td>
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
                    <tr style="height: 42px;">
                        <td style="padding:2px 3px; text-align:center; vertical-align:top; font-size:9px; border:1px solid #555;">${item.name ? (i + 1) : ''}</td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9px; border:1px solid #555;">${item.distributor}</td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9px; border:1px solid #555;"></td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9px; border:1px solid #555;">${item.name}</td>
                        <td style="padding:2px 3px; text-align:center; vertical-align:top; font-size:9px; border:1px solid #555;">${item.weight}</td>
                        <td style="padding:2px 3px; vertical-align:top; font-size:9px; border:1px solid #555;">${item.source}</td>
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
                <table style="width:100%; table-layout:fixed; word-break:normal; word-wrap:break-word; overflow-wrap:break-word; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:9px;" border="1">
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
                <table style="width:100%; table-layout:fixed; word-break:normal; word-wrap:break-word; overflow-wrap:break-word; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:9px;" border="1">
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
        } else if (sample.form_type === 'MU.10-005') {
            mainTableHTML = `
                <table style="width:100%; table-layout:fixed; word-break:normal; word-wrap:break-word; overflow-wrap:break-word; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:8.5px;" border="1">
                    <thead>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle;">
                            <th rowspan="2" style="padding:4px 2px; border:1px solid #555; width:3.5%;">ลำดับ</th>
                            <th rowspan="2" style="padding:4px 2px; border:1px solid #555; width:12%;">ชื่อผู้จำหน่าย/ร้านค้า</th>
                            <th rowspan="2" style="padding:4px 2px; border:1px solid #555; width:12%;">ชื่ออาหาร/ยี่ห้อ</th>
                            <th colspan="6" style="padding:4px 2px; border:1px solid #555; width:57.5%;">การตรวจสอบฉลาก</th>
                            <th colspan="2" style="padding:4px 2px; border:1px solid #555; width:15%;">ผลตรวจ</th>
                        </tr>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle; font-size:8px;">
                            <th style="padding:3px 2px; border:1px solid #555; width:12%;">เลขสารบบอาหาร</th>
                            <th style="padding:3px 2px; border:1px solid #555; width:15%;">ชื่อ/ที่อยู่ ผู้ผลิต<br>หรือจัดจำหน่าย</th>
                            <th style="padding:3px 2px; border:1px solid #555; width:7%;">วันผลิต/<br>หมดอายุ<br>(มี/ไม่มี)</th>
                            <th style="padding:3px 2px; border:1px solid #555; width:7%;">น้ำหนักสุทธิ</th>
                            <th style="padding:3px 2px; border:1px solid #555; width:9.5%;">แสดงข้อความ<br>“ควรเก็บในที่ร่ม<br>และแห้ง” (มี/ไม่มี)</th>
                            <th style="padding:3px 2px; border:1px solid #555; width:7%;">สรุปผล<br>ตรวจฉลาก</th>
                            <th style="padding:3px 2px; border:1px solid #555; width:8%;">ค่าไอโอเดท<br>(ppm)</th>
                            <th style="padding:3px 2px; border:1px solid #555; width:7%;">สรุปผล</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        } else {
            mainTableHTML = `
                <table style="width:100%; table-layout:fixed; word-break:normal; word-wrap:break-word; overflow-wrap:break-word; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:9px;" border="1">
                    <thead>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle;">
                            <th style="padding:5px 3px; border:1px solid #555; width:4%;">ลำดับ</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:13%;">ชื่อผู้จำหน่าย</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:9%;">รหัสตัวอย่าง<br><span style="font-weight:normal;font-size:8.5px;">(สำหรับผู้ตรวจ<br>วิเคราะห์)</span></th>
                            <th style="padding:5px 3px; border:1px solid #555; width:13%;">ชื่อตัวอย่าง</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:5%;">ปริมาณ<br>ตัวอย่าง<br>(กรัม)</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">แหล่งที่มา</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:12%;">สารที่ตรวจวิเคราะห์</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:18%;">การแปลผล</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:10%;">ผลการตรวจ<br>วิเคราะห์</th>
                            <th style="padding:5px 3px; border:1px solid #555; width:6%;">สรุปผล</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                    </table>
            `;
        }

        let htmlContent = '';
        if (sample.form_type === 'MU.10-004') {
            const firstItem = sampleItems[0] || {};
            
            // Map food categories
            const isFlour = (firstItem.food_category || '').includes('พวกแป้ง');
            const isMeat = (firstItem.food_category || '').includes('เนื้อสัตว์');
            const isMeatProduct = (firstItem.food_category || '').includes('ผลิตภัณฑ์จากเนื้อสัตว์');
            const isMix = (firstItem.food_category || '').includes('พวกผสม');
            const isOtherFood = firstItem.food_category && !isFlour && !isMeat && !isMeatProduct && !isMix;

            // Map oil types
            const isPalm = firstItem.oil_type === 'น้ำมันปาล์ม';
            const isLard = firstItem.oil_type === 'น้ำมันหมู';
            const isSoy = firstItem.oil_type === 'น้ำมันถั่วเหลือง';
            const isOtherOil = firstItem.oil_type && !isPalm && !isLard && !isSoy;

            // Map replacement types
            const isRepNone = firstItem.replacement_type === 'ไม่เปลี่ยนเลย';
            const isRepPart = firstItem.replacement_type === 'เปลี่ยนบางส่วน';
            const isRepAll = firstItem.replacement_type === 'เปลี่ยนใหม่ทั้งหมด';
            const isRepOther = firstItem.replacement_type && !isRepNone && !isRepPart && !isRepAll;

            // Generate 7 table rows
            let tableRowsHTML = '';
            for (let i = 0; i < 7; i++) {
                const item = sampleItems[i];
                if (item) {
                    const isPass = sample.status === 'approved' || sample.status === 'summarized' ? (sample.analysis_summary || '').includes('ผ่าน') && !(sample.analysis_summary || '').includes('ไม่ผ่าน') : false;
                    const isFail = sample.status === 'approved' || sample.status === 'summarized' ? (sample.analysis_summary || '').includes('ไม่ผ่าน') : false;
                    
                    tableRowsHTML += `
                        <tr style="height: 22px; text-align:center;">
                            <td style="border:1px solid #555; vertical-align:middle; font-size:9px;">${i + 1}</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:9px;">${samplingDate}</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">${isPass ? '&#9745;' : '&#9744;'}</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">&#9744;</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">${isFail ? '&#9745;' : '&#9744;'}</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">${isFail ? '&#9745;' : '&#9744;'}</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">${isPass ? '&#9745;' : '&#9744;'}</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:9px; font-weight:bold;">${isPass ? 'ผ่าน' : (isFail ? 'ไม่ผ่าน' : '')}</td>
                        </tr>
                    `;
                } else {
                    tableRowsHTML += `
                        <tr style="height: 22px; text-align:center;">
                            <td style="border:1px solid #555; vertical-align:middle; font-size:9px;">${i + 1}</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:9px;">&nbsp;</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">&#9744;</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">&#9744;</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">&#9744;</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">&#9744;</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:10px;">&#9744;</td>
                            <td style="border:1px solid #555; vertical-align:middle; font-size:9px;">&nbsp;</td>
                        </tr>
                    `;
                }
            }

            htmlContent = `
            <style>
                * {
                    font-family: 'SarabunPDF', 'Leelawadee UI', 'Leelawadee', 'Segoe UI', 'Tahoma', 'Microsoft Sans Serif', sans-serif !important;
                    font-variant-ligatures: normal !important;
                    -webkit-font-variant-ligatures: normal !important;
                    font-feature-settings: "liga" 1, "ccmp" 1, "mkmk" 1, "mark" 1 !important;
                    -webkit-font-feature-settings: "liga" 1, "ccmp" 1, "mkmk" 1, "mark" 1 !important;
                    letter-spacing: normal !important;
                }
            </style>

            <div style="font-family: 'Tahoma', 'SarabunPDF', 'TH Sarabun New', sans-serif; width: 1000px !important; min-height: 1414px; background: #fff; display: block; position: relative; margin: 0; padding: 0; box-sizing: border-box;">
            <div style="width: 904px; margin: 4mm 0 4mm 48px; display: block; font-size: 9.5px; color: #000;">
                
                <!-- HEADER -->
                <table style="width: 100%; margin:0 0 6px 0; border-collapse:collapse; border: 1.5px solid #333;">
                    <tr>
                        <td style="width:70px; padding:6px; text-align:center; border-right:1px solid #aaa; vertical-align:middle;">
                            <img src="data:image/jpeg;base64,${logoBase64}" style="display:block; margin:auto; width:52px; height:auto;">
                        </td>
                        <td style="padding:6px 12px; vertical-align:middle; line-height:1.7; color:#000;">
                            <div><strong>ประเภทเอกสาร : แบบบันทึก</strong></div>
                            <div><strong>ชื่อเอกสาร : <span>แบบบันทึกการสุ่มตัวอย่างน้ำมันทอดซ้ำ (Test Kit)</span></strong></div>
                            <div><strong>วันที่เริ่มใช้ :</strong> </div>
                            <div><strong>แผนก :</strong> ห้องปฏิบัติการหน่วยเคลื่อนที่เพื่อความปลอดภัยด้านอาหาร เขตสุขภาพที่ 10</div>
                        </td>
                        <td style="width:160px; padding:6px 12px; border-left:1px solid #aaa; vertical-align:middle; text-align:left; color:#000;">
                            <div style="font-size:11px;"><strong>หมายเลขเอกสาร :</strong> <span>MU.10-004</span></div>
                            <div style="margin-top:6px; font-size:11px;"><strong>แก้ไขครั้งที่ :</strong> <span>002</span></div>
                        </td>
                    </tr>
                </table>

                <!-- META FIELDS -->
                <div style="width: 100%; line-height:1.6; margin-bottom:6px; color:#000; font-size:9.5px;">
                    <div>(เจ้าหน้าที่) หน่วยงานที่เก็บตัวอย่าง ....<u>${sample.agency || '......................................................'}</u>.... อำเภอ ....<u>${sample.amphoe || '........................................'}</u>.... จังหวัด ....<u>${sample.province || '..........................................'}</u>....</div>
                    <div style="margin-top:2px;">(ผู้ประกอบการ) ชื่อสถานที่ ....<u>${sample.location_name || '..............................................................'}</u>.... เจ้าของร้าน/ผู้ดูแล ..........................................................................</div>
                    <div style="margin-top:2px;">ที่อยู่ ........................................................................................... เบอร์โทร ........................................................................................</div>
                </div>
                <hr style="width: 100%; border:none; border-top:1.5px solid #333; margin:0 0 6px 0;">

                <!-- QUESTIONNAIRE -->
                <div style="width: 100%; line-height:1.5; color:#000; font-size:9.5px; margin-bottom:8px;">
                    <div><strong>ประเภท</strong> &nbsp;
                        ${isFlour ? '&#9745;' : '&#9744;'} พวกแป้ง เช่น ปาท่องโก๋ กล้วยแขก มันทอด ขนมไข่นกกระทา ฯลฯ ระบุชนิดอาหาร ....<u>${isFlour ? (firstItem.food_type || '..................................................') : '..................................................'}</u>....
                    </div>
                    <div style="margin-top:1px; padding-left:38px;">
                        ${isMeat ? '&#9745;' : '&#9744;'} เนื้อสัตว์ เช่น ไก่ทอด ปลาทอด หมูทอด ฯลฯ ระบุชนิดอาหาร ....<u>${isMeat ? (firstItem.food_type || '..................................................') : '..................................................'}</u>....
                    </div>
                    <div style="margin-top:1px; padding-left:38px;">
                        ${isMeatProduct ? '&#9745;' : '&#9744;'} ผลิตภัณฑ์จากเนื้อสัตว์ เช่น ลูกชิ้น ไส้กรอก ฯลฯ ระบุชนิดอาหาร ....<u>${isMeatProduct ? (firstItem.food_type || '..................................................') : '..................................................'}</u>....
                    </div>
                    <div style="margin-top:1px; padding-left:38px;">
                        ${isMix ? '&#9745;' : '&#9744;'} พวกผสม เช่น ไก่ชุบแป้งทอด ปลาชุบแป้งทอด ฯลฯ ระบุชนิดอาหาร ....<u>${isMix ? (firstItem.food_type || '..................................................') : '..................................................'}</u>....
                    </div>
                    <div style="margin-top:1px; padding-left:38px;">
                        ${isOtherFood ? '&#9745;' : '&#9744;'} อื่นๆ ระบุ ....<u>${isOtherFood ? (firstItem.food_category + (firstItem.food_type ? ' - ' + firstItem.food_type : '')) : '..............................................................................................................................................'}</u>....
                    </div>

                    <div style="margin-top:3px;">
                        <strong>ชนิดน้ำมัน</strong> &nbsp;&nbsp;
                        ${isPalm ? '&#9745;' : '&#9744;'} น้ำมันปาล์ม &nbsp;&nbsp;
                        ${isLard ? '&#9745;' : '&#9744;'} น้ำมันหมู &nbsp;&nbsp;
                        ${isSoy ? '&#9745;' : '&#9744;'} น้ำมันถั่วเหลือง &nbsp;&nbsp;
                        ${isOtherOil ? '&#9745;' : '&#9744;'} อื่น ๆ ระบุ ....<u>${isOtherOil ? firstItem.oil_type : '.......................................................................................'}</u>....
                    </div>

                    <div style="margin-top:3px;">
                        <strong>ระยะเวลาใช้ทอด</strong> ....<u>${firstItem.fry_duration || '............'}</u>.... นาที/ครั้ง &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>จำนวนครั้งที่ทอด</strong> ....<u>${firstItem.fry_count || '............'}</u>.... ครั้ง/วัน
                    </div>

                    <div style="margin-top:3px;">
                        <strong>ลักษณะการเปลี่ยนน้ำมัน</strong> &nbsp;&nbsp;
                        ${isRepNone ? '&#9745;' : '&#9744;'} ไม่เปลี่ยนเลย &nbsp;&nbsp;
                        ${isRepPart ? '&#9745;' : '&#9744;'} เปลี่ยนบางส่วน &nbsp;&nbsp;
                        ${isRepAll ? '&#9745;' : '&#9744;'} เปลี่ยนใหม่ทั้งหมด &nbsp;&nbsp;
                        ${isRepOther ? '&#9745;' : '&#9744;'} อื่น ๆ ระบุ ....<u>${isRepOther ? firstItem.replacement_type : '........................'}</u>....
                    </div>

                    <div style="margin-top:3px;">
                        <strong>ความถี่ในการเปลี่ยนน้ำมัน</strong> ....<u>${firstItem.replacement_frequency || '............'}</u>.... วัน
                    </div>
                </div>

                <!-- MAIN TABLE -->
                <table style="width: 100%; table-layout:fixed; word-break:normal; word-wrap:break-word; overflow-wrap:break-word; margin:0; border-collapse:collapse; border:1.5px solid #333; font-size:9px; color:#000;" border="1">
                    <thead>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle;">
                            <th rowspan="2" style="border:1px solid #555; width:8%; font-size:9px;">ครั้งที่<br>เก็บตัวอย่าง</th>
                            <th rowspan="2" style="border:1px solid #555; width:15%; font-size:9px;">วันที่เก็บตัวอย่าง<br>(ว/ด/ป)</th>
                            <th colspan="3" style="border:1px solid #555; width:36%; font-size:9px; padding:2px;">ผลการตรวจสารโพลาร์</th>
                            <th colspan="2" style="border:1px solid #555; width:28%; font-size:9px; padding:2px;">การแปลผล</th>
                            <th rowspan="2" style="border:1px solid #555; width:13%; font-size:9px;">สรุปผล</th>
                        </tr>
                        <tr style="background:#f5f5f5; text-align:center; vertical-align:middle; font-size:8px;">
                            <th style="border:1px solid #555; padding:2px;">สีชมพู<br>&lt; 20%</th>
                            <th style="border:1px solid #555; padding:2px;">สีชมพูจาง<br>20 - 25%</th>
                            <th style="border:1px solid #555; padding:2px;">ไม่มีสี<br>&gt; 25%</th>
                            <th style="border:1px solid #555; padding:2px;">น้ำมันเสื่อมแล้ว</th>
                            <th style="border:1px solid #555; padding:2px;">น้ำมันยังใช้ได้</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHTML}
                    </tbody>
                </table>

                <div style="width: 100%; margin:6px 0; font-size:9.5px; color:#000;">
                    <strong>สรุปผล</strong> ควรเปลี่ยนน้ำมันใหม่หลังทอดเสร็จในวันที่ ...................................................................................................................................
                </div>
                <hr style="width: 100%; border:none; border-top:1.5px solid #333; margin:0 0 6px 0;">

                <!-- NOTE BOX -->
                <table style="width: 100%; border:1px solid #000; border-collapse:collapse; font-size:8.5px; line-height:1.4; color:#000; margin-bottom:8px;">
                    <tr>
                        <td style="padding:6px 12px; border-right:1px solid #000; width:50%; vertical-align:top;">
                            <div style="font-weight:bold; text-decoration:underline; margin-bottom:4px; font-size:9px;">การเก็บตัวอย่างน้ำมัน</div>
                            <strong>๑. การนับวันเก็บตัวอย่างน้ำมัน</strong><br>
                            - ให้นับวันที่เริ่มใช้น้ำมันใหม่เป็นวันที่ ๑<br>
                            - เก็บตัวอย่างน้ำมันหลังจากการทอดทุกวัน จนกว่าจะเปลี่ยนน้ำมันใหม่
                        </td>
                        <td style="padding:6px 12px; width:50%; vertical-align:top;">
                            <div style="font-weight:bold; visibility:hidden; margin-bottom:4px; font-size:9px;">การเก็บตัวอย่างน้ำมัน</div>
                            <strong>๒. วิธีการเก็บตัวอย่างน้ำมัน</strong><br>
                            - ตั้งน้ำมันทิ้งไว้ให้เย็น<br>
                            - ใช้ช้อนตักประมาณ ๒ ช้อนโต๊ะ เทใส่ภาชนะกันร้อน เก็บไว้ในที่เย็นให้พ้นแสง<br>
                            - เขียนวันที่เก็บตัวอย่างที่ข้างภาชนะโดยใช้ปากกากันสีกันน้ำ
                        </td>
                    </tr>
                </table>

                <!-- FOOTER SIGNATURES -->
                <table style="width: 100%; margin:8px 0 0 0; border-collapse:collapse; font-size:9px; color: #000; line-height:1.6;">
                    <tr>
                        <td style="width:33%; vertical-align:top; padding-right:10px;">
                            <div>ลงชื่อผู้เก็บตัวอย่าง ....<u>${sample.collector_name || '................................................'}</u>....</div>
                            <div style="margin-top:4px;">ตำแหน่ง ....<u>${sample.collector_position || '........................................................'}</u>....</div>
                            <div style="margin-top:4px;">วันที่เก็บตัวอย่าง ....<u>${samplingDate || '............................................'}</u>....</div>
                        </td>
                        <td style="width:33%; vertical-align:top; text-align:center; padding:0 10px;">
                            <div>ลงชื่อผู้ตรวจวิเคราะห์ ................................................ , ................................................</div>
                            <div style="margin-top:4px;">ตำแหน่ง ........................................................</div>
                            <div style="margin-top:4px;">วันที่ตรวจวิเคราะห์ ............................................</div>
                        </td>
                        <td style="width:33%; vertical-align:top; text-align:right;">
                            <div>ลงชื่อผู้ทบทวนเอกสาร ................................................</div>
                            <div style="margin-top:4px;">ตำแหน่ง พนง. ห้องปฏิบัติการหน่วยเคลื่อนที่ฯ เขตสุขภาพที่ 10</div>
                            <div style="margin-top:4px;">วันที่ทบทวนเอกสาร ............................................</div>
                        </td>
                    </tr>
                </table>
            </div>
            </div>`;
        } else {
            htmlContent = `
            <style>
                * {
                    font-family: 'SarabunPDF', 'Leelawadee UI', 'Leelawadee', 'Segoe UI', 'Tahoma', 'Microsoft Sans Serif', sans-serif !important;
                    font-variant-ligatures: normal !important;
                    -webkit-font-variant-ligatures: normal !important;
                    font-feature-settings: "liga" 1, "ccmp" 1, "mkmk" 1, "mark" 1 !important;
                    -webkit-font-feature-settings: "liga" 1, "ccmp" 1, "mkmk" 1, "mark" 1 !important;
                    letter-spacing: normal !important;
                }
            </style>

            <div style="font-family: 'Tahoma', 'SarabunPDF', 'TH Sarabun New', sans-serif; width: 1400px !important; min-height: 990px; background: #fff; display: block; position: relative; margin: 0; padding: 0; box-sizing: border-box;">
            <div style="width: 1304px; margin: 4mm 0 4mm 48px; display: block; font-size: 10.5px; color: #1a1a1a;">

                <!-- HEADER -->
                <table style="width:100%; margin:0 0 5px 0; border-collapse:collapse; border: 1.5px solid #333;">
                    <tr>
                        <td style="width:70px; padding:6px; text-align:center; border-right:1px solid #aaa; vertical-align:middle;">
                            <img src="data:image/jpeg;base64,${logoBase64}" style="display:block; margin:auto; width:52px; height:auto;">
                        </td>
                        <td style="padding:6px 12px; vertical-align:middle; line-height:1.8; color:#000;">
                            <div><strong>ประเภทเอกสาร : แบบบันทึก</strong></div>
                            <div><strong>ชื่อเอกสาร : <span>${documentName}</span></strong></div>
                            <div><strong>วันที่เริ่มใช้ :</strong> </div>
                            <div><strong>แผนก :</strong> ห้องปฏิบัติการหน่วยเคลื่อนที่เพื่อความปลอดภัยด้านอาหาร เขตสุขภาพที่ 10</div>
                        </td>
                        <td style="width:160px; padding:6px 12px; border-left:1px solid #aaa; vertical-align:middle; text-align:left; color:#000;">
                            <div style="font-size:12px;"><strong>หมายเลขเอกสาร :</strong> <span>${documentNum}</span></div>
                            <div style="margin-top:6px; font-size:12px;"><strong>แก้ไขครั้งที่ :</strong> <span>002</span></div>
                        </td>
                    </tr>
                </table>

                <!-- META FIELDS -->
                <table style="width:100%; margin:0 0 4px 0; border-collapse:collapse; color:#000;">
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
                <table style="width:100%; margin:10px 0 0 0; border-collapse:collapse; font-size:9.5px; color: #000;">
                    <tr>
                        <td style="width:33%; vertical-align:top; padding-right:10px;">
                            <div>ลงชื่อผู้เก็บตัวอย่าง ....<u>${sample.collector_name || '................................................'}</u>....</div>
                            <div style="margin-top:6px;">ตำแหน่ง ....<u>${sample.collector_position || '........................................................'}</u>....</div>
                            <div style="margin-top:6px;">วันที่เก็บตัวอย่าง ....<u>${samplingDate || '............................................'}</u>....</div>
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
            </div>
            </div>`;
        }

        const opt = {
            margin: [6, 0, 6, 0],
            filename: `${sample.form_type}_${sample.ref_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: false, 
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: sample.form_type === 'MU.10-004' ? 1000 : 1400
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: sample.form_type === 'MU.10-004' ? 'portrait' : 'landscape' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        Swal.fire({
            title: 'กำลังสร้าง PDF...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Add printing class to body to hide sidebar and reset margins
        const sidebarEl = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('sidebar') : null;
        const mainContentEl = (typeof document !== 'undefined' && typeof document.querySelector === 'function') ? document.querySelector('.main-content') : null;
        
        if (typeof document !== 'undefined' && document.body && document.body.classList) {
            document.body.classList.add('is-printing-pdf');
        }
        if (sidebarEl) sidebarEl.style.setProperty('display', 'none', 'important');
        if (mainContentEl) {
            mainContentEl.style.setProperty('margin-left', '0', 'important');
            mainContentEl.style.setProperty('padding', '0', 'important');
        }

        // Generate PDF directly from the HTML string
        setTimeout(() => {
            html2pdf().set(opt).from(htmlContent).save().then(function() {
                if (typeof document !== 'undefined' && document.body && document.body.classList) {
                    document.body.classList.remove('is-printing-pdf');
                }
                if (sidebarEl) sidebarEl.style.removeProperty('display');
                if (mainContentEl) {
                    mainContentEl.style.removeProperty('margin-left');
                    mainContentEl.style.removeProperty('padding');
                }
                Swal.close();
            }).catch(function(err) {
                if (typeof document !== 'undefined' && document.body && document.body.classList) {
                    document.body.classList.remove('is-printing-pdf');
                }
                if (sidebarEl) sidebarEl.style.removeProperty('display');
                if (mainContentEl) {
                    mainContentEl.style.removeProperty('margin-left');
                    mainContentEl.style.removeProperty('padding');
                }
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
            'รหัสแลป': s.lab_no || s.lab_id || '-',
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
