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

const app = {
    // Current authenticated user (null if not logged in)
    currentUser: null,
    
    // Application Data (mocked in localStorage)
    users: [],
    samples: [],

    // Initialization
    init() {
        try {
            this.initData();
            this.setupEventListeners();
            this.updateAuthUI();
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
            document.getElementById('sampleSubmissionForm').reset();
            document.getElementById('btnExportSubmissionPDF').disabled = true;
        });

        // Submit form
        document.getElementById('sampleSubmissionForm').addEventListener('submit', this.handleFormSubmit.bind(this));
        document.getElementById('btnExportSubmissionPDF').addEventListener('click', this.generateSubmissionPDF.bind(this));

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
                dynamicHTML = `
                    <div class="form-grid">
                        <div class="form-group">
                            <label>ค่าโพลาร์ (Polar compounds) %</label>
                            <input type="number" step="0.1" name="polar_value" placeholder="เช่น 24.5">
                        </div>
                        <div class="form-group">
                            <label>อุณหภูมิน้ำมันขณะตรวจวัด (°C)</label>
                            <input type="number" step="1" name="oil_temp" placeholder="เช่น 170">
                        </div>
                    </div>
                `;
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
    },

    addGlobalSampleEntry() {
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

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(e.target);
        const sampleData = Object.fromEntries(formData.entries());
        
        // Generate Temporary Ref ID
        const tempId = 'TEMP-' + Math.floor(10000 + Math.random() * 90000);
        sampleData.ref_id = tempId;
        sampleData.status = 'registered';
        sampleData.created_at = new Date().toISOString();
        
        this.samples.unshift(sampleData);
        this.saveSamples();
        
        Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลเข้าระบบสำเร็จ',
            html: `รหัสอ้างอิงชั่วคราวของคุณคือ: <b>${tempId}</b><br>กรุณาดาวน์โหลดแบบฟอร์ม PDF เพื่อแนบส่งพร้อมตัวอย่าง`,
            confirmButtonText: 'ตกลง'
        });
        
        // Enable PDF Download
        document.getElementById('btnExportSubmissionPDF').disabled = false;
        document.getElementById('btnExportSubmissionPDF').dataset.refId = tempId;
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
        const opt = {
            margin:       10,
            filename:     `Certificate_${document.getElementById('cert-pdf-no').innerText}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    },

    generateSubmissionPDF(e) {
        const refId = e.currentTarget.dataset.refId;
        const sample = this.samples.find(s => s.ref_id === refId);
        if(!sample) return;

        // Collect all dynamic sample entries from sample object keys
        const sampleItems = [];
        let idx = 1;
        while (sample[`sample_name_${idx}`] !== undefined) {
            sampleItems.push({
                name: sample[`sample_name_${idx}`] || '',
                distributor: sample[`distributor_${idx}`] || '',
                weight: sample[`weight_${idx}`] || '',
                source: sample[`source_${idx}`] || '',
            });
            idx++;
        }
        // fallback: if old single-entry style
        if (sampleItems.length === 0) {
            sampleItems.push({
                name: sample.sample_name || '',
                distributor: sample.distributor || '',
                weight: '',
                source: sample.source || '',
            });
        }

        // Ensure at least 5 rows for the table
        while (sampleItems.length < 5) sampleItems.push({ name:'', distributor:'', weight:'', source:'' });

        const checkboxCell = `
            <div style="font-size:10px; line-height:1.8;">
                <div>☐ ยาฆ่าแมลง (GT Kit)</div>
                <div>☐ ยาฆ่าแมลง (TM/2 Kit)</div>
            </div>`;

        const interpretCell = `
            <div style="font-size:9px; line-height:1.8;">
                <div>☐ สีตัวอย่าง = สีควบคุม</div>
                <div>☐ สีควบคุม > สีตัวอย่าง ≥ สีตัดสิน</div>
                <div>☐ สีตัวอย่าง ≥ 2 สีตัดสิน</div>
                <div>☐ พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ</div>
                <div>☐ ไม่พบ Spot สีเทา สีน้ำตาลเข้มถึงดำ</div>
            </div>`;

        const resultCell = `
            <div style="font-size:9px; line-height:1.8;">
                <div>☐ ไม่พบ</div>
                <div>☐ พบ</div>
                <div>☐ พบปลอดภัย</div>
                <div>☐ พบอันตราย</div>
            </div>`;

        const summaryCell = `
            <div style="font-size:9px; line-height:1.8;">
                <div>☐ ผ่าน</div>
                <div>☐ ไม่ผ่าน</div>
            </div>`;

        const tableRows = sampleItems.map((item, i) => `
            <tr style="height: 80px;">
                <td style="padding:4px; text-align:center; vertical-align:top; font-size:11px;">${i + 1}</td>
                <td style="padding:4px; vertical-align:top; font-size:10px;">${item.distributor}</td>
                <td style="padding:4px; vertical-align:top; font-size:10px;"></td>
                <td style="padding:4px; vertical-align:top; font-size:10px;">${item.name}</td>
                <td style="padding:4px; text-align:center; vertical-align:top; font-size:10px;">${item.weight}</td>
                <td style="padding:4px; vertical-align:top; font-size:10px;">${item.source}</td>
                <td style="padding:4px; vertical-align:top;">${checkboxCell}</td>
                <td style="padding:4px; vertical-align:top;">${interpretCell}</td>
                <td style="padding:4px; vertical-align:top;">${resultCell}</td>
                <td style="padding:4px; vertical-align:top;">${summaryCell}</td>
            </tr>`).join('');

        const samplingDate = sample.sampling_date ? new Date(sample.sampling_date).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric'}) : '';

        const htmlContent = `
        <div style="font-family: 'Sarabun', 'TH Sarabun New', sans-serif; width: 270mm; padding: 8mm; font-size: 11px; color: #1a1a1a; box-sizing: border-box;">

            <!-- HEADER -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:6px; border: 1.5px solid #333;">
                <tr>
                    <td style="width:70px; padding:6px; text-align:center; border-right:1px solid #aaa; vertical-align:middle;">
                        <!-- Logo placeholder -->
                        <div style="width:60px; height:60px; border:2px solid #cc2222; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:auto; font-size:9px; color:#cc2222; font-weight:bold; text-align:center; line-height:1.2;">MOBILE<br>UNIT</div>
                    </td>
                    <td style="padding:6px 12px; vertical-align:middle; line-height:2;">
                        <div><strong>ประเภทเอกสาร : แบบบันทึก</strong></div>
                        <div><strong>ชื่อเอกสาร : แบบบันทึก<span style="color:#cc2222;">การเก็บกลุ่มตัวอย่างอาหาร (กลุ่มผักและผลไม้)</span></strong></div>
                        <div><strong>วันที่เริ่มใช้ :</strong> 1 ตุลาคม 2567</div>
                        <div><strong>แผนก :</strong> ห้องปฏิบัติการหน่วยเคลื่อนที่เพื่อความปลอดภัยด้านอาหาร เขตสุขภาพที่ 10</div>
                    </td>
                    <td style="width:160px; padding:6px 12px; border-left:1px solid #aaa; vertical-align:middle; text-align:left;">
                        <div style="font-size:12px;"><strong>หมายเลขเอกสาร :</strong> <span style="color:#cc2222;">MU.10-001</span></div>
                        <div style="margin-top:6px; font-size:12px;"><strong>แก้ไขครั้งที่ :</strong> <span style="color:#cc2222;">002</span></div>
                    </td>
                </tr>
            </table>

            <!-- META FIELDS -->
            <table style="width:100%; margin-bottom:4px; border-collapse:collapse;">
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
            <table style="width:100%; border-collapse:collapse; border:1.5px solid #333; font-size:10px;" border="1">
                <thead>
                    <tr style="background:#f5f5f5; text-align:center; vertical-align:middle;">
                        <th style="padding:5px 3px; border:1px solid #555; width:4%;">ลำดับ</th>
                        <th style="padding:5px 3px; border:1px solid #555; width:10%;">ชื่อผู้จำหน่าย<br><span style="font-weight:normal;font-size:9px;">(สำหรับผู้ตรวจ<br>วิเคราะห์)</span></th>
                        <th style="padding:5px 3px; border:1px solid #555; width:8%;">รหัสตัวอย่าง</th>
                        <th style="padding:5px 3px; border:1px solid #555; width:10%;">ชื่อตัวอย่าง</th>
                        <th style="padding:5px 3px; border:1px solid #555; width:7%;"><span style="color:#cc2222;">ปริมาณ<br>ตัวอย่าง<br>(กรัม)</span></th>
                        <th style="padding:5px 3px; border:1px solid #555; width:9%;">แหล่งที่มา</th>
                        <th style="padding:5px 3px; border:1px solid #555; width:14%;"><span style="color:#cc2222;">สารที่ตรวจวิเคราะห์</span></th>
                        <th style="padding:5px 3px; border:1px solid #555; width:18%;"><span style="color:#cc2222;">การแปลผล</span></th>
                        <th style="padding:5px 3px; border:1px solid #555; width:11%;">ผลการตรวจ<br>วิเคราะห์</th>
                        <th style="padding:5px 3px; border:1px solid #555; width:9%;">สรุปผล</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>

            <!-- FOOTER SIGNATURES -->
            <table style="width:100%; margin-top:20px; border-collapse:collapse; font-size:10px;">
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
                        <div style="margin-top:6px; font-size:9px;">ผอ.ผนก ห้องปฏิบัติการหน่วยเคลื่อนที่เพื่อ เขตสุขภาพที่ 10</div>
                        <div style="margin-top:6px;">วันที่ทบทวนเอกสาร ............................................</div>
                    </td>
                </tr>
            </table>
        </div>`;

        const hiddenContainer = document.getElementById('hiddenFormPDFContainer');
        hiddenContainer.innerHTML = htmlContent;
        hiddenContainer.style.display = 'block';

        const opt = {
            margin:       0,
            filename:     `MU.10-001_${sample.ref_id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        
        html2pdf().set(opt).from(hiddenContainer).save().then(() => {
            hiddenContainer.style.display = 'none';
        });
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
