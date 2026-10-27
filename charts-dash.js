/**
 * SSKMOPH Dashboard Charts Configuration
 * Integrates Chart.js for data visualization across Region 10
 */

let provinceChartInstance = null;
let resultRatioChartInstance = null;
let formTypeChartInstance = null;

// Initialize Dashboard Charts
function initDashboardCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Skipping chart initialization.');
        return;
    }
    const provinceCtx = document.getElementById('provinceChart')?.getContext('2d');
    const resultRatioCtx = document.getElementById('resultRatioChart')?.getContext('2d');
    const formTypeCtx = document.getElementById('formTypeChart')?.getContext('2d');

    if (!provinceCtx || !resultRatioCtx || !formTypeCtx) return;

    // Set Global Chart Defaults for Clean Light Dashboard Theme
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#64748b';
        Chart.defaults.font.family = "'Kanit', sans-serif";
    }

    // 1. Province Chart (Bar Chart) - Clean Blue Accents
    function createBarGrad(ctx, c1, c2) {
        const g = ctx.createLinearGradient(0, 0, 0, 280);
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);
        return g;
    }

    const grad1 = createBarGrad(provinceCtx, '#38bdf8', '#2563eb');
    const grad2 = createBarGrad(provinceCtx, '#60a5fa', '#1d4ed8');
    const grad3 = createBarGrad(provinceCtx, '#22d3ee', '#0284c7');
    const grad4 = createBarGrad(provinceCtx, '#818cf8', '#4338ca');
    const grad5 = createBarGrad(provinceCtx, '#7dd3fc', '#0369a1');

    // 1. Province Chart (Bar Chart) - Outcrowd Vertical Cobalt Gradients
    provinceChartInstance = new Chart(provinceCtx, {
        type: 'bar',
        data: {
            labels: ['ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ', 'มุกดาหาร', 'ยโสธร'],
            datasets: [{
                label: 'จำนวนตัวอย่างที่ส่งตรวจ (รายจังหวัด)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [grad1, grad2, grad3, grad4, grad5],
                borderColor: ['#38bdf8', '#60a5fa', '#22d3ee', '#818cf8', '#7dd3fc'],
                borderWidth: 1.5,
                borderRadius: 10,
                barPercentage: 0.52
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#ffffff',
                    titleColor: '#0f172a',
                    bodyColor: '#334155',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12,
                    boxPadding: 4,
                    usePointStyle: true,
                    titleFont: { family: 'Kanit', weight: 'bold' },
                    bodyFont: { family: 'Kanit' },
                    callbacks: {
                        label: function(context) {
                            return ` ${context.parsed.y} ตัวอย่าง`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#64748b',
                        font: { family: 'Kanit' }
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' }
                },
                x: {
                    ticks: {
                        color: '#1e293b',
                        font: { family: 'Kanit', weight: 'bold' }
                    },
                    grid: { display: false }
                }
            }
        }
    });

    // 2. Result Ratio Chart (Doughnut Chart)
    resultRatioChartInstance = new Chart(resultRatioCtx, {
        type: 'doughnut',
        data: {
            labels: ['ผ่านเกณฑ์มาตรฐาน', 'ไม่ผ่านเกณฑ์มาตรฐาน', 'รอการตรวจวิเคราะห์'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#10b981',  /* Emerald - Pass */
                    '#f43f5e',  /* Coral - Fail */
                    '#f59e0b'   /* Amber - Pending */
                ],
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Kanit', size: 12 },
                        padding: 15,
                        usePointStyle: true,
                        color: '#334155'
                    }
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleColor: '#38bdf8',
                    bodyColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderWidth: 1,
                    cornerRadius: 10,
                    padding: 12
                }
            }
        }
    });

    // 3. Form Type Chart (Horizontal Bar Chart) - Electric Cyan / Coral
    formTypeChartInstance = new Chart(formTypeCtx, {
        type: 'bar',
        data: {
            labels: [
                'ยาฆ่าแมลง',
                'สารบอแรกซ์',
                'สารฟอร์มาลิน',
                'สารฟอกขาว',
                'สารกันรา',
                'สารเร่งเนื้อแดง',
                'สารโพลาร์ในน้ำมันทอดอาหาร',
                'โคลิฟอร์มในอาหาร',
                'โคลิฟอร์มในน้ำ'
            ],
            datasets: [
                {
                    label: 'ผ่านเกณฑ์',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(56, 189, 248, 0.85)',
                    borderColor: '#38bdf8',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: 'ไม่ผ่านเกณฑ์',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(244, 63, 94, 0.85)',
                    borderColor: '#f43f5e',
                    borderWidth: 1,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    labels: { font: { family: 'Kanit' }, color: '#334155', usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleColor: '#38bdf8',
                    bodyColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderWidth: 1,
                    cornerRadius: 10,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.parsed.y} ตัวอย่าง`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: { font: { family: 'Kanit', size: 11 }, color: '#64748b', autoSkip: false, maxRotation: 45, minRotation: 0 },
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#64748b', font: { family: 'Kanit' } },
                    grid: { color: 'rgba(0, 0, 0, 0.06)' }
                }
            }
        }
    });
}

// Update charts with actual data from database

// Substance dictionary and helper matching functions
window.substanceDictionary = {
    'all': { label: 'สารที่ตรวจวิเคราะห์ทั้งหมด (9 รายการ)', icon: 'fa-flask' },
    'pesticide': { label: 'ยาฆ่าแมลง', form: 'MU.10-001', icon: 'fa-leaf' },
    'borax': { label: 'สารบอแรกซ์', form: 'MU.10-002', icon: 'fa-drumstick-bite' },
    'formalin': { label: 'สารฟอร์มาลิน', form: 'MU.10-002', icon: 'fa-fish' },
    'bleach': { label: 'สารฟอกขาว', form: 'MU.10-002', icon: 'fa-wand-magic-sparkles' },
    'salicylic': { label: 'สารกันรา', form: 'MU.10-002', icon: 'fa-seedling' },
    'agonist': { label: 'สารเร่งเนื้อแดง', form: 'MU.10-002', icon: 'fa-bacon' },
    'polar': { label: 'สารโพลาร์ในน้ำมันทอดอาหาร', form: 'MU.10-003, 004', icon: 'fa-fire' },
    'coliformFood': { label: 'โคลิฟอร์มในอาหาร', form: 'MU.10-007', icon: 'fa-bowl-food' },
    'coliformWater': { label: 'โคลิฟอร์มในน้ำ', form: 'MU.10-006', icon: 'fa-droplet' },
};

window.itemMatchesSubstance = function(s, idx, targetSubstance) {
    if (s.form_type === 'MU.10-008') return false; // Exclude foodLabel from dashboard entirely
    if (!targetSubstance || targetSubstance === 'all') return true;
    if (targetSubstance === 'pesticide') return s.form_type === 'MU.10-001';
    if (targetSubstance === 'polar') return s.form_type === 'MU.10-003' || s.form_type === 'MU.10-004';
    if (targetSubstance === 'coliformWater') return s.form_type === 'MU.10-006';
    if (targetSubstance === 'coliformFood') return s.form_type === 'MU.10-007';
    
    if (s.form_type === 'MU.10-002') {
        const getVal = (key) => idx ? (s[key + '_' + idx] !== undefined ? s[key + '_' + idx] : s[key]) : s[key];
        if (getVal('test_' + targetSubstance)) return true;
        const hasSpecificResult = (idx ? s['analysis_summary_' + idx + '_' + targetSubstance] : '') 
                               || s['analysis_summary_' + targetSubstance]
                               || (idx ? s['analysis_details_' + idx + '_' + targetSubstance] : '')
                               || s['analysis_details_' + targetSubstance];
        if (hasSpecificResult) return true;
        const textToCheck = [
            idx ? s['sample_name_' + idx] : s.sample_name,
            idx ? s['analysis_details_' + idx] : s.analysis_details,
            s.analysis_details,
            s.analysis_comment
        ].filter(Boolean).join(' ');
        const substanceKeywords = {
            'borax': ['บอแรกซ์', 'borax'],
            'formalin': ['ฟอร์มาลิน', 'formalin'],
            'bleach': ['ฟอกขาว', 'ไฮโดรซัลไฟต์', 'bleach'],
            'salicylic': ['กันรา', 'ซาลิซิลิค', 'salicylic'],
            'agonist': ['เร่งเนื้อแดง', 'agonist']
        };
        if (substanceKeywords[targetSubstance] && substanceKeywords[targetSubstance].some(w => textToCheck.includes(w))) {
            return true;
        }
        const anyTestSpecified = ['borax', 'formalin', 'bleach', 'salicylic', 'agonist'].some(k => {
            if (getVal('test_' + k)) return true;
            if (substanceKeywords[k].some(w => textToCheck.includes(w))) return true;
            return false;
        });
        if (!anyTestSpecified && targetSubstance === 'borax') return true;
        return false;
    }
    return false;
};

window.getItemSubstanceSummary = function(s, idx, targetSubstance) {
    if (!targetSubstance || targetSubstance === 'all') {
        let sum = (idx ? (s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx] || s['analysis_coliform_summary_' + idx] || s['label_summary_' + idx]) : '')
                || s.analysis_summary_outcome 
                || s.analysis_summary 
                || '';
        if (!sum && s.form_type === 'MU.10-002' && idx) {
            const keys = ['borax', 'formalin', 'bleach', 'salicylic', 'agonist'];
            const itemSums = keys.map(k => s['analysis_summary_' + idx + '_' + k]).filter(Boolean);
            if (itemSums.some(x => x.includes('ไม่ผ่าน'))) sum = 'ไม่ผ่าน';
            else if (itemSums.length > 0) sum = 'ผ่าน';
        }
        return sum;
    }

    if (s.form_type === 'MU.10-001' || s.form_type === 'MU.10-007') {
        return (idx ? (s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx]) : '') || s.analysis_summary_outcome || s.analysis_summary || '';
    }

    if (s.form_type === 'MU.10-008') {
        return (idx ? (s['label_summary_' + idx] || s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx]) : '') || s.label_summary || s.analysis_summary_outcome || s.analysis_summary || '';
    }

    if (s.form_type === 'MU.10-006') {
        const sum = (idx ? (s['analysis_coliform_summary_' + idx] || s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx]) : '')
                 || s.analysis_coliform_summary_1
                 || s.analysis_coliform_summary
                 || s.analysis_summary_outcome
                 || s.analysis_summary
                 || '';
        if (sum.includes('ไม่ผ่าน')) return 'ไม่ผ่าน';
        if (sum.includes('ผ่าน')) return 'ผ่าน';
        const val = idx ? s['analysis_coliform_' + idx] : (s.analysis_coliform_1 !== undefined ? s.analysis_coliform_1 : s.analysis_coliform);
        if (val !== undefined && val !== null && val !== '') {
            const num = parseFloat(val);
            if (!isNaN(num)) return num > 0 ? 'ไม่ผ่าน' : 'ผ่าน';
        }
        return sum;
    }

    if (s.form_type === 'MU.10-003' || s.form_type === 'MU.10-004') {
        const rawVal = (idx ? s['polar_value_' + idx] : '') || s.polar_value || s.analysis_interpretation || s.analysis_interpretation_4;
        const num = parseFloat(rawVal);
        if (!isNaN(num)) return num <= 25 ? 'ผ่าน' : 'ไม่ผ่าน';
        return s.analysis_summary || '';
    }

    if (s.form_type === 'MU.10-002') {
        const val = (idx ? s['analysis_summary_' + idx + '_' + targetSubstance] : '') || s['analysis_summary_' + targetSubstance];
        if (val && val.includes('ไม่ผ่าน')) return 'ไม่ผ่าน';
        if (val && val.includes('ผ่าน')) return 'ผ่าน';
        const det = (idx ? s['analysis_detail_results_' + idx + '_' + targetSubstance] : '') || s['analysis_detail_results_' + targetSubstance] || (idx ? s['analysis_details_' + idx + '_' + targetSubstance] : '') || s['analysis_details_' + targetSubstance];
        if (det && det.includes('ไม่พบ')) return 'ผ่าน';
        if (det && det.includes('พบ')) return 'ไม่ผ่าน';
        
        const textToCheck = [
            idx ? s['sample_name_' + idx] : s.sample_name,
            idx ? s['analysis_details_' + idx] : s.analysis_details,
            s.analysis_details,
            s.analysis_comment
        ].filter(Boolean).join(' ');
        if (textToCheck.includes('ไม่พบ')) return 'ผ่าน';
        if (textToCheck.includes('พบ')) return 'ไม่ผ่าน';
        return s.analysis_summary || (s.status === 'approved' ? 'ผ่าน' : '');
    }

    return '';
};

function updateDashboardCharts(samples) {
    if (typeof Chart === 'undefined') return;
    if (!provinceChartInstance || !resultRatioChartInstance || !formTypeChartInstance) {
        initDashboardCharts();
    }
    if (!provinceChartInstance || !resultRatioChartInstance || !formTypeChartInstance) return;

    const filterEl = document.getElementById('dashProvinceFilter');
    if (filterEl && filterEl.value !== 'all') {
        samples = samples.filter(s => s.province === filterEl.value);
    }

    const subFilterEl = document.getElementById('dashSubstanceFilter');
    const targetSubstance = subFilterEl ? subFilterEl.value : 'all';
    
    // Sync active style on Province Quick Filter chips
    const curProv = filterEl ? filterEl.value : 'all';
    document.querySelectorAll('.outcrowd-explore-card:not(#substance-explore-chips) .explore-chips:not(#substance-explore-chips) .explore-chip').forEach(chip => {
        if ((curProv === 'all' && chip.innerText.includes('ทั้งหมด')) || (curProv !== 'all' && chip.innerText.includes(curProv))) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    // Sync active style on Substance Quick Filter chips
    const curSub = subFilterEl ? subFilterEl.value : 'all';
    document.querySelectorAll('#substance-explore-chips .explore-chip').forEach(chip => {
        if ((curSub === 'all' && chip.innerText.includes('ทั้งหมด')) || (curSub !== 'all' && chip.getAttribute('onclick') && chip.getAttribute('onclick').includes(curSub))) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    const startDateEl = document.getElementById('dashStartDate');
    const endDateEl = document.getElementById('dashEndDate');
    if (startDateEl && startDateEl.value) {
        samples = samples.filter(s => {
            const d = s.collection_date || s.sampling_date || (s.created_at ? s.created_at.split('T')[0] : '');
            return d && d >= startDateEl.value;
        });
    }
    if (endDateEl && endDateEl.value) {
        samples = samples.filter(s => {
            const d = s.collection_date || s.sampling_date || (s.created_at ? s.created_at.split('T')[0] : '');
            return d && d <= endDateEl.value;
        });
    }

// Substance Filter (initialized above)

    // 1. Calculate Province distribution (Count by items matching targetSubstance)
    const provinces = ['ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ', 'มุกดาหาร', 'ยโสธร'];
    const provinceCounts = provinces.map(prov => {
        let count = 0;
        samples.filter(s => s.province === prov).forEach(s => {
            let idx = 1;
            let hasItems = false;
            while (s['sample_name_' + idx] !== undefined && idx <= 50) {
                hasItems = true;
                if (window.itemMatchesSubstance(s, idx, targetSubstance)) count++;
                idx++;
            }
            if (!hasItems && s.sample_name) {
                if (window.itemMatchesSubstance(s, null, targetSubstance)) count++;
            }
        });
        return count;
    });

    provinceChartInstance.data.datasets[0].data = provinceCounts;
    provinceChartInstance.update();

    // Update Province Quick Metric Badges (Outcrowd Top Metric Columns)
    const pIds = ['pm-sisaket', 'pm-ubon', 'pm-amnat', 'pm-muk', 'pm-yasothon'];
    pIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.innerText = provinceCounts[i] || 0;
    });

    // 2. Calculate Outcome ratios (Count by items matching targetSubstance)
    let passed = 0;
    let failed = 0;
    let pending = 0;

    samples.forEach(s => {
        if (s.status === 'rejected') return;
        
        let idx = 1;
        let hasItems = false;

        const processOutcomeItem = (index) => {
            if (!window.itemMatchesSubstance(s, index, targetSubstance)) return;
            hasItems = true;
            if (s.status === 'registered' || s.status === 'accepted' || s.status === 'analyzed' || s.status === 'summarized' || s.status === 'analyst_signed') {
                pending++;
            } else if (s.status === 'approved') {
                let sum = window.getItemSubstanceSummary(s, index, targetSubstance);
                if (sum.includes('ไม่ผ่าน')) failed++;
                else if (sum.includes('ผ่าน')) passed++;
                else passed++;
            }
        };

        while (s['sample_name_' + idx] !== undefined && idx <= 50) {
            processOutcomeItem(idx);
            idx++;
        }
        if (!hasItems && s.sample_name) {
            processOutcomeItem(null);
        }
    });

    const totalOutcomes = passed + failed + pending;
    if (totalOutcomes === 0) {
        resultRatioChartInstance.data.labels = ['ไม่มีข้อมูล'];
        resultRatioChartInstance.data.datasets[0].data = [1];
        resultRatioChartInstance.data.datasets[0].backgroundColor = ['#e2e8f0'];
    } else {
        resultRatioChartInstance.data.labels = ['ผ่านเกณฑ์มาตรฐาน', 'ไม่ผ่านเกณฑ์มาตรฐาน', 'รอการตรวจวิเคราะห์'];
        resultRatioChartInstance.data.datasets[0].data = [passed, failed, pending];
        resultRatioChartInstance.data.datasets[0].backgroundColor = ['#10b981', '#f43f5e', '#f59e0b'];
    }
    resultRatioChartInstance.update();

    // Update Outcrowd Insights Card
    const insightRateEl = document.getElementById('dash-insight-rate');
    if (insightRateEl) {
        const passPercent = (passed + failed) > 0 ? ((passed / (passed + failed)) * 100).toFixed(0) : 100;
        insightRateEl.innerText = `${passPercent}%`;
    }
    const insightSubEl = document.querySelector('.outcrowd-insights-card .insights-sub');
    if (insightSubEl) {
        if (targetSubstance !== 'all' && window.substanceDictionary[targetSubstance]) {
            insightSubEl.innerText = 'อัตราผ่านเกณฑ์: ' + window.substanceDictionary[targetSubstance].label;
        } else {
            insightSubEl.innerText = 'ภาพรวมการตรวจวิเคราะห์ เขตสุขภาพที่ 10';
        }
    }
    // Call Substance Charts Update
    if (typeof updateSubstanceCharts === 'function') {
        updateSubstanceCharts(samples);
    }
}




let substanceChartInstances = {};
window.currentFailedSamples = {};

function updateSubstanceCharts(samples) {
    const stats = {
        'pesticide': { label: 'ยาฆ่าแมลง', total: 0, pass: 0, fail: 0 },
        'borax': { label: 'สารบอแรกซ์', total: 0, pass: 0, fail: 0 },
        'formalin': { label: 'สารฟอร์มาลิน', total: 0, pass: 0, fail: 0 },
        'bleach': { label: 'สารฟอกขาว', total: 0, pass: 0, fail: 0 },
        'salicylic': { label: 'สารกันรา', total: 0, pass: 0, fail: 0 },
        'agonist': { label: 'สารเร่งเนื้อแดง', total: 0, pass: 0, fail: 0 },
        'polar': { label: 'สารโพลาร์ในน้ำมันทอดอาหาร', total: 0, pass: 0, fail: 0 },
        'coliformFood': { label: 'โคลิฟอร์มในอาหาร', total: 0, pass: 0, fail: 0 },
        'coliformWater': { label: 'โคลิฟอร์มในน้ำ', total: 0, pass: 0, fail: 0 },
    };
    
    // Reset global failed samples
    for(let k in stats) {
        window.currentFailedSamples[k] = [];
    }

    samples.forEach(s => {
        let idx = 1;
        let hasItems = false;
        while (s['sample_name_' + idx] !== undefined && idx <= 50) {
            hasItems = true;
            if (s['item_status_' + idx] !== 'rejected') {
                checkItem(s, idx, stats);
            }
            idx++;
        }
        if (!hasItems && s.sample_name && s.status !== 'rejected') {
            checkItem(s, null, stats);
        }
    });

    function checkItem(s, idx, stats) {
        const getVal = (key) => idx ? (s[key + '_' + idx] !== undefined ? s[key + '_' + idx] : s[key]) : s[key];
        
        const getSummary = (key) => {
            const val = (idx ? s['analysis_summary_' + idx + '_' + key] : '') || s['analysis_summary_' + key];
            if (val && val.includes('ไม่ผ่าน')) return 'ไม่ผ่าน';
            if (val && val.includes('ผ่าน')) return 'ผ่าน';
            const det = (idx ? s['analysis_detail_results_' + idx + '_' + key] : '') || s['analysis_detail_results_' + key] || (idx ? s['analysis_details_' + idx + '_' + key] : '') || s['analysis_details_' + key];
            if (det && det.includes('ไม่พบ')) return 'ผ่าน';
            if (det && det.includes('พบ')) return 'ไม่ผ่าน';
            return null;
        };

        const getSingleSummary = () => {
             const sum = (idx ? (s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx]) : '')
                      || s.analysis_summary_outcome 
                      || s.analysis_summary 
                      || '';
             if (sum.includes('ไม่ผ่าน')) return 'ไม่ผ่าน';
             if (sum.includes('ผ่าน')) return 'ผ่าน';
             return null;
        };

        const getColiformWaterSummary = () => {
             const sum = (idx ? (s['analysis_coliform_summary_' + idx] || s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx]) : '')
                      || s.analysis_coliform_summary_1
                      || s.analysis_coliform_summary
                      || s.analysis_summary_outcome
                      || s.analysis_summary
                      || '';
             if (sum.includes('ไม่ผ่าน')) return 'ไม่ผ่าน';
             if (sum.includes('ผ่าน')) return 'ผ่าน';
             
             // Check numeric coliform value if present
             const val = idx ? s['analysis_coliform_' + idx] : (s.analysis_coliform_1 !== undefined ? s.analysis_coliform_1 : s.analysis_coliform);
             if (val !== undefined && val !== null && val !== '') {
                 const num = parseFloat(val);
                 if (!isNaN(num)) {
                     return num > 0 ? 'ไม่ผ่าน' : 'ผ่าน';
                 }
             }
             return null;
        };

        const inc = (type, summaryVal) => {
            stats[type].total++;
            if (summaryVal && summaryVal.includes('ผ่าน') && !summaryVal.includes('ไม่ผ่าน')) {
                stats[type].pass++;
            } else if (summaryVal && summaryVal.includes('ไม่ผ่าน')) {
                stats[type].fail++;
                let subName = idx ? s['sample_name_'+idx] : s.sample_name;
                window.currentFailedSamples[type].push({
                    name: subName || s.sample_id || '-',
                    code: s.lab_id || s.sample_id || s.ref_id || '-',
                    date: s.collection_date || s.sampling_date || '-',
                    province: s.province || '-',
                    district: s.amphoe || s.district || '-',
                    source: s.agency || s.source || '-',
                    location: s.collection_place || s.collection_location || s.location_name || '-',
                    form_type: s.form_type || '-'
                });
            } else if (s.status === 'approved') {
                stats[type].pass++;
            }
        };

        if (s.form_type === 'MU.10-001') {
            inc('pesticide', getSingleSummary());
        } else if (s.form_type === 'MU.10-002') {
            let matchedTest = false;
            ['borax', 'formalin', 'bleach', 'salicylic', 'agonist'].forEach(k => {
                if (getVal('test_' + k)) {
                    matchedTest = true;
                    inc(k, getSummary(k));
                }
            });
            if (!matchedTest) {
                ['borax', 'formalin', 'bleach', 'salicylic', 'agonist'].forEach(k => {
                    const sk = getSummary(k);
                    if (sk) {
                        matchedTest = true;
                        inc(k, sk);
                    }
                });
            }
            if (!matchedTest) {
                const textToCheck = [
                    idx ? s['sample_name_' + idx] : s.sample_name,
                    idx ? s['analysis_details_' + idx] : s.analysis_details,
                    s.analysis_details,
                    s.analysis_comment,
                    s.analysis_summary
                ].filter(Boolean).join(' ');

                const substanceKeywords = {
                    'borax': ['บอแรกซ์', 'borax'],
                    'formalin': ['ฟอร์มาลิน', 'formalin'],
                    'bleach': ['ฟอกขาว', 'ไฮโดรซัลไฟต์', 'bleach'],
                    'salicylic': ['กันรา', 'ซาลิซิลิค', 'salicylic'],
                    'agonist': ['เร่งเนื้อแดง', 'agonist']
                };

                for (const [k, words] of Object.entries(substanceKeywords)) {
                    if (words.some(w => textToCheck.includes(w))) {
                        matchedTest = true;
                        let outcome = getSingleSummary();
                        if (!outcome) {
                            if (textToCheck.includes('ไม่พบ')) outcome = 'ผ่าน';
                            else if (textToCheck.includes('พบ')) outcome = 'ไม่ผ่าน';
                            else outcome = s.status === 'approved' ? 'ผ่าน' : null;
                        }
                        inc(k, outcome);
                        break;
                    }
                }
                if (!matchedTest && s.status === 'approved') {
                    inc('borax', getSingleSummary());
                }
            }
        } else if (s.form_type === 'MU.10-003' || s.form_type === 'MU.10-004') {
            const rawVal = getVal('polar_value') || getVal('analysis_interpretation') || getVal('analysis_interpretation_4');
            const num = parseFloat(rawVal);
            if (!isNaN(num)) {
                 stats['polar'].total++;
                 if (num <= 25) {
                     stats['polar'].pass++;
                 } else {
                     stats['polar'].fail++;
                     let subName = idx ? s['sample_name_'+idx] : s.sample_name;
                     window.currentFailedSamples['polar'].push({
                         name: subName || s.sample_id || '-',
                         code: s.lab_id || s.sample_id || s.ref_id || '-',
                         date: s.collection_date || s.sampling_date || '-',
                         province: s.province || '-',
                         district: s.amphoe || s.district || '-',
                         source: s.agency || s.source || '-',
                         location: s.collection_place || s.collection_location || s.location_name || '-',
                         form_type: s.form_type || '-'
                     });
                 }
            } else {
                 inc('polar', getSingleSummary());
            }
        } else if (s.form_type === 'MU.10-007') {
            inc('coliformFood', getSingleSummary());
        } else if (s.form_type === 'MU.10-006') {
            inc('coliformWater', getColiformWaterSummary());
        }
    }

    const grid = document.getElementById('substance-charts-grid');
    if (!grid) return;

    const subFilterEl = document.getElementById('dashSubstanceFilter');
    const targetSubstance = subFilterEl ? subFilterEl.value : 'all';
    
    if (typeof formTypeChartInstance !== 'undefined' && formTypeChartInstance) {
        const passedCounts = Object.values(stats).map(s => s.pass);
        const failedCounts = Object.values(stats).map(s => s.fail);
        formTypeChartInstance.data.labels = Object.values(stats).map(s => s.label);
        formTypeChartInstance.data.datasets[0].data = passedCounts;
        formTypeChartInstance.data.datasets[1].data = failedCounts;
        formTypeChartInstance.update();
    }

    // Store samples and stats globally for interactive re-rendering
    window.currentCachedSamples = samples;
    window.currentCachedStats = stats;

    // Render modern substance analytics UI (Requirements 1, 2, 3)
    renderModernSubstanceAnalytics(samples, stats);

    // Call update safety rankings
    if (typeof updateSafetyRankings === 'function') {
        updateSafetyRankings(stats);
    }
}

// Update TOP 3 Safest & TOP 3 Least Safe Rankings
function updateSafetyRankings(stats) {
    const safeContainer = document.getElementById('top-safe-list');
    const dangerContainer = document.getElementById('top-danger-list');
    if (!safeContainer || !dangerContainer) return;

    const subFilterEl = document.getElementById('dashSubstanceFilter');
    const targetSubstance = subFilterEl ? subFilterEl.value : 'all';

    // If a specific substance is selected, show Province-level safety ranking for that substance!
    if (targetSubstance !== 'all') {
        const subInfo = window.substanceDictionary[targetSubstance] || { label: targetSubstance };
        const safeTitle = document.querySelector('.safe-panel .ranking-title');
        const safeSubtitle = document.querySelector('.safe-panel .ranking-subtitle');
        const dangerTitle = document.querySelector('.danger-panel .ranking-title');
        const dangerSubtitle = document.querySelector('.danger-panel .ranking-subtitle');

        if (safeTitle) safeTitle.innerText = 'TOP 3 จังหวัดปลอดภัยสูงสุด (' + subInfo.label + ')';
        if (safeSubtitle) safeSubtitle.innerText = 'ร้อยละการตรวจผ่านเกณฑ์มาตรฐานของ ' + subInfo.label;
        if (dangerTitle) dangerTitle.innerText = 'TOP 3 จังหวัดที่ต้องเฝ้าระวัง (' + subInfo.label + ')';
        if (dangerSubtitle) dangerSubtitle.innerText = 'ร้อยละการตรวจไม่ผ่านเกณฑ์ของ ' + subInfo.label;

        // Calculate province stats for this substance
        const provinces = ['ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ', 'มุกดาหาร', 'ยโสธร'];
        const provStats = provinces.map(p => {
            let total = 0, pass = 0, fail = 0;
            (app.samples || []).filter(s => s.province === p).forEach(s => {
                let idx = 1, hasItems = false;
                const checkProvItem = (index) => {
                    if (!window.itemMatchesSubstance(s, index, targetSubstance)) return;
                    hasItems = true;
                    total++;
                    if (s.status === 'approved') {
                        let sum = window.getItemSubstanceSummary(s, index, targetSubstance);
                        if (sum.includes('ไม่ผ่าน')) fail++;
                        else pass++;
                    }
                };
                while (s['sample_name_' + idx] !== undefined && idx <= 50) { checkProvItem(idx); idx++; }
                if (!hasItems && s.sample_name) checkProvItem(null);
            });
            const passRate = total > 0 ? (pass / total) * 100 : 0;
            const failRate = total > 0 ? (fail / total) * 100 : 0;
            return { label: p, total, pass, fail, passRate, failRate };
        }).filter(p => p.total > 0);

        const topSafeProv = [...provStats].sort((a,b) => b.passRate - a.passRate || b.pass - a.pass).slice(0,3);
        const topDangerProv = [...provStats].sort((a,b) => b.failRate - a.failRate || b.fail - a.fail).slice(0,3);

        const medalColors = [
            { bg: 'linear-gradient(135deg, #10b981, #059669)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', text: '#ffffff' }
        ];

        safeContainer.innerHTML = topSafeProv.length === 0 
            ? '<div class="ranking-empty-state"><i class="fa-solid fa-circle-info"></i> ไม่พบตัวอย่างสารนี้ในพื้นที่</div>'
            : topSafeProv.map((item, idx) => {
                const m = medalColors[idx] || medalColors[2];
                const pPct = item.passRate.toFixed(1);
                return `
                    <div class="ranking-item safe-item">
                        <div class="ranking-badge" style="background: ${m.bg}; color: ${m.text};">${idx + 1}</div>
                        <div class="ranking-info">
                            <div class="ranking-item-top">
                                <span class="ranking-item-name">${item.label}</span>
                                <span class="ranking-item-pct safe-pct">${pPct}% ผ่าน</span>
                            </div>
                            <div class="ranking-bar-track">
                                <div class="ranking-bar-fill safe-fill" style="width: ${pPct}%;"></div>
                            </div>
                            <div class="ranking-item-sub">
                                <span><i class="fa-solid fa-check" style="color: #059669; margin-right: 4px;"></i>ผ่าน ${item.pass} จาก ${item.total} ตัวอย่าง</span>
                                <span class="ranking-total-badge">ตรวจ ${item.total} รายการ</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

        const dangerColors = [
            { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #f97316, #ea580c)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', text: '#ffffff' }
        ];

        dangerContainer.innerHTML = topDangerProv.length === 0
            ? '<div class="ranking-empty-state"><i class="fa-solid fa-circle-info"></i> ไม่พบตัวอย่างสารนี้ในพื้นที่</div>'
            : topDangerProv.map((item, idx) => {
                const d = dangerColors[idx] || dangerColors[2];
                const fPct = item.failRate.toFixed(1);
                const hasFail = item.fail > 0;
                return `
                    <div class="ranking-item danger-item">
                        <div class="ranking-badge" style="background: ${d.bg}; color: ${d.text};">${idx + 1}</div>
                        <div class="ranking-info">
                            <div class="ranking-item-top">
                                <span class="ranking-item-name">${item.label}</span>
                                <span class="ranking-item-pct ${hasFail ? 'danger-pct' : 'neutral-pct'}">
                                    ${hasFail ? fPct + '% ไม่ผ่าน' : '0% ไม่ผ่าน (ปลอดภัย)'}
                                </span>
                            </div>
                            <div class="ranking-bar-track">
                                <div class="ranking-bar-fill ${hasFail ? 'danger-fill' : 'neutral-fill'}" style="width: ${hasFail ? fPct : 0}%;"></div>
                            </div>
                            <div class="ranking-item-sub">
                                <span>
                                    ${hasFail 
                                        ? '<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444; margin-right: 4px;"></i>ไม่ผ่าน ' + item.fail + ' จาก ' + item.total + ' ตัวอย่าง' 
                                        : '<i class="fa-solid fa-shield-check" style="color:#10b981; margin-right: 4px;"></i>ผ่านครบทุกตัวอย่าง (100%)'}
                                </span>
                                <span class="ranking-total-badge">ตรวจ ${item.total} รายการ</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        return;
    }

    // Reset default headers when viewing all substances
    const safeTitle = document.querySelector('.safe-panel .ranking-title');
    const safeSubtitle = document.querySelector('.safe-panel .ranking-subtitle');
    const dangerTitle = document.querySelector('.danger-panel .ranking-title');
    const dangerSubtitle = document.querySelector('.danger-panel .ranking-subtitle');
    if (safeTitle) safeTitle.innerText = 'TOP 3 สารที่ปลอดภัยที่สุด';
    if (safeSubtitle) safeSubtitle.innerText = 'ร้อยละการตรวจผ่านเกณฑ์มาตรฐานสูงสุด';
    if (dangerTitle) dangerTitle.innerText = 'TOP 3 สารที่ปลอดภัยน้อยที่สุด';
    if (dangerSubtitle) dangerSubtitle.innerText = 'ร้อยละการตรวจไม่ผ่านเกณฑ์ / พบความเสี่ยงสูงสุด';

    

    // Filter active substances that have tested samples
    const active = Object.keys(stats).map(k => ({ key: k, ...stats[k] })).filter(item => item.total > 0);

    active.forEach(item => {
        item.passRate = item.total > 0 ? (item.pass / item.total) * 100 : 0;
        item.failRate = item.total > 0 ? (item.fail / item.total) * 100 : 0;
    });

    // 1. TOP 3 Safest: Highest passRate desc, then higher pass count, then total
    const topSafe = [...active].sort((a, b) => b.passRate - a.passRate || b.pass - a.pass || b.total - a.total).slice(0, 3);

    // 2. TOP 3 Least Safe: Highest failRate desc, then higher fail count, then total
    const topDanger = [...active].sort((a, b) => b.failRate - a.failRate || b.fail - a.fail || b.total - a.total).slice(0, 3);

    // Render Safe List
    if (topSafe.length === 0) {
        safeContainer.innerHTML = `
            <div class="ranking-empty-state">
                <i class="fa-solid fa-circle-info"></i> ยังไม่มีข้อมูลตัวอย่างที่ตรวจวิเคราะห์
            </div>
        `;
    } else {
        const medalColors = [
            { bg: 'linear-gradient(135deg, #10b981, #059669)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', text: '#ffffff' }
        ];

        safeContainer.innerHTML = topSafe.map((item, idx) => {
            const m = medalColors[idx] || medalColors[2];
            const pPct = item.passRate.toFixed(1);
            return `
                <div class="ranking-item safe-item">
                    <div class="ranking-badge" style="background: ${m.bg}; color: ${m.text};">
                        ${idx + 1}
                    </div>
                    <div class="ranking-info">
                        <div class="ranking-item-top">
                            <span class="ranking-item-name">${item.label}</span>
                            <span class="ranking-item-pct safe-pct">${pPct}% ผ่าน</span>
                        </div>
                        <div class="ranking-bar-track">
                            <div class="ranking-bar-fill safe-fill" style="width: ${pPct}%;"></div>
                        </div>
                        <div class="ranking-item-sub">
                            <span><i class="fa-solid fa-check" style="color: #059669; margin-right: 4px;"></i>ผ่าน ${item.pass} จาก ${item.total} ตัวอย่าง</span>
                            <span class="ranking-total-badge">ตรวจ ${item.total} รายการ</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Danger List
    if (topDanger.length === 0) {
        dangerContainer.innerHTML = `
            <div class="ranking-empty-state">
                <i class="fa-solid fa-circle-info"></i> ยังไม่มีข้อมูลตัวอย่างที่ตรวจวิเคราะห์
            </div>
        `;
    } else {
        const dangerColors = [
            { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #f97316, #ea580c)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', text: '#ffffff' }
        ];

        dangerContainer.innerHTML = topDanger.map((item, idx) => {
            const d = dangerColors[idx] || dangerColors[2];
            const fPct = item.failRate.toFixed(1);
            const hasFail = item.fail > 0;
            return `
                <div class="ranking-item danger-item">
                    <div class="ranking-badge" style="background: ${d.bg}; color: ${d.text};">
                        ${idx + 1}
                    </div>
                    <div class="ranking-info">
                        <div class="ranking-item-top">
                            <span class="ranking-item-name">${item.label}</span>
                            <span class="ranking-item-pct ${hasFail ? 'danger-pct' : 'neutral-pct'}">
                                ${hasFail ? `${fPct}% ไม่ผ่าน` : '0% ไม่ผ่าน (ปลอดภัย)'}
                            </span>
                        </div>
                        <div class="ranking-bar-track">
                            <div class="ranking-bar-fill ${hasFail ? 'danger-fill' : 'neutral-fill'}" style="width: ${hasFail ? fPct : 0}%;"></div>
                        </div>
                        <div class="ranking-item-sub">
                            <span>
                                ${hasFail 
                                    ? `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444; margin-right: 4px;"></i>ไม่ผ่าน ${item.fail} จาก ${item.total} ตัวอย่าง` 
                                    : `<i class="fa-solid fa-shield-check" style="color:#10b981; margin-right: 4px;"></i>ผ่านครบทุกตัวอย่าง (100%)`}
                            </span>
                            ${hasFail ? `
                                <button type="button" class="ranking-view-btn" onclick="openFailedSamplesModal('${item.key}', '${item.label}')">
                                    <i class="fa-solid fa-magnifying-glass"></i> ดูตัวอย่าง
                                </button>
                            ` : `<span class="ranking-total-badge">ตรวจ ${item.total} รายการ</span>`}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Global functions for modal
window.openFailedSamplesModal = function(key, label) {
    document.getElementById('failedSubstanceName').innerText = label;
    const tbody = document.getElementById('failedSamplesTableBody');
    tbody.innerHTML = '';
    
    let samples = [];
    if (key === 'all') {
        for (const k in window.currentFailedSamples) {
            if (k !== 'all' && Array.isArray(window.currentFailedSamples[k])) {
                samples = samples.concat(window.currentFailedSamples[k]);
            }
        }
    } else {
        samples = window.currentFailedSamples[key] || [];
    }
    
    if (samples.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">ไม่พบข้อมูลตัวอย่างที่ไม่ผ่าน</td></tr>';
        const pieWrapper = document.getElementById('failedSamplesPieChart')?.parentElement?.parentElement;
        if(pieWrapper) pieWrapper.style.display = 'none';
    } else {
        // Use a Map or Set to prevent showing exact duplicates if a single sample has multiple sub-items failing the same substance (rare but possible)
        let uniqueSamples = [];
        let seen = new Set();
        samples.forEach(s => {
            let identifier = s.name + s.date + s.province;
            if(!seen.has(identifier)) {
                seen.add(identifier);
                uniqueSamples.push(s);
            }
        });

        // Aggregate counts for pie chart
        let nameCounts = {};
        uniqueSamples.forEach(s => {
            let n = s.name || 'ไม่ระบุ';
            nameCounts[n] = (nameCounts[n] || 0) + 1;
        });
        
        let chartLabels = Object.keys(nameCounts).map(name => `${name} (${nameCounts[name]})`);
        let chartData = Object.values(nameCounts);
        
        let pieCtx = document.getElementById('failedSamplesPieChart');
        if (pieCtx) {
            if (window.failedSamplesPieChartInstance) {
                window.failedSamplesPieChartInstance.destroy();
            }
            // Only draw chart if there is data
            if (chartData.length > 0) {
                pieCtx.parentElement.parentElement.style.display = 'flex';
                window.failedSamplesPieChartInstance = new Chart(pieCtx, {
                    type: 'doughnut',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            data: chartData,
                            backgroundColor: [
                                '#ef4444', '#f97316', '#eab308', '#84cc16', 
                                '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', 
                                '#d946ef', '#f43f5e', '#64748b'
                            ],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { font: { family: 'Kanit', size: 11 }, usePointStyle: true, padding: 12 }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return ' ' + context.label + ': ' + context.parsed + ' ตัวอย่าง';
                                    }
                                }
                            }
                        }
                    }
                });
            } else {
                pieCtx.parentElement.parentElement.style.display = 'none';
            }
        }

        uniqueSamples.forEach((s, idx) => {
            let tr = document.createElement('tr');
            const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
            tr.style.backgroundColor = rowBg;
            tr.style.borderBottom = '1px solid #e2e8f0';
            tr.style.transition = 'background-color 0.2s';
            tr.onmouseover = () => tr.style.backgroundColor = '#f1f5f9';
            tr.onmouseout = () => tr.style.backgroundColor = rowBg;

            tr.innerHTML = `
                <td style="padding: 12px 16px;">
                    <div style="font-weight: 600; color: #0f172a;">${s.name || '-'}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;"><i class="fa-solid fa-barcode"></i> ${s.code || '-'}</div>
                </td>
                <td style="padding: 12px 16px; color: #334155;">${s.date ? new Date(s.date).toLocaleDateString('th-TH') : '-'}</td>
                <td style="padding: 12px 16px;">
                    <div style="color: #0f172a; font-weight: 500;">${s.source || '-'}</div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px;"><i class="fa-solid fa-location-dot"></i> ${s.location || '-'}</div>
                </td>
                <td style="padding: 12px 16px;">
                    <div style="color: #0f172a;">อ.${s.district || '-'}</div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px;">จ.${s.province || '-'}</div>
                </td>
                <td style="padding: 12px 16px;">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 700; border: 1px solid #bae6fd; white-space: nowrap;">
                        ${s.form_type || '-'}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    document.getElementById('failedSamplesModal').classList.add('active');
};

window.closeFailedSamplesModal = function() {
    document.getElementById('failedSamplesModal').classList.remove('active');
};


// Outcrowd Quick Filter Helper
window.filterProvinceQuick = function(province) {
    const filterEl = document.getElementById('dashProvinceFilter');
    if (filterEl) {
        filterEl.value = province;
        filterEl.dispatchEvent(new Event('change'));
    }
    document.querySelectorAll('.explore-chip').forEach(chip => {
        if ((province === 'all' && chip.innerText.includes('ทั้งหมด')) || (province !== 'all' && chip.innerText.includes(province))) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
};

// Outcrowd Substance Quick Filter Helper
window.filterSubstanceQuick = function(substanceKey) {
    const filterEl = document.getElementById('dashSubstanceFilter');
    if (filterEl) {
        filterEl.value = substanceKey;
        filterEl.dispatchEvent(new Event('change'));
    }
    document.querySelectorAll('#substance-explore-chips .explore-chip').forEach(chip => {
        if ((substanceKey === 'all' && chip.innerText.includes('ทั้งหมด')) || (substanceKey !== 'all' && chip.getAttribute('onclick') && chip.getAttribute('onclick').includes(substanceKey))) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
};


// ==========================================================================
// MODERN SUBSTANCE ANALYTICS (Coast & Usage + Business/General Stats)
// ==========================================================================
let monthlySubstanceChartInstance = null;
window.currentActiveSubstance = 'all';

// Fiscal Month Index Calculator (ต.ค. 69 = 0, ..., ก.ย. 70 = 11)
function getFiscalMonthIndex(rawDate) {
    if (!rawDate) return 0;
    let y = 0, m = 0;
    if (typeof rawDate === 'string' && rawDate.includes('-')) {
        const parts = rawDate.split('T')[0].split('-');
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
    } else {
        const dt = new Date(rawDate);
        if (!isNaN(dt.getTime())) {
            y = dt.getFullYear();
            m = dt.getMonth() + 1;
        }
    }
    if (!m) return 0;
    if (y > 2500) y -= 543;
    if (m >= 10) return m - 10;
    return m + 2;
}

// Render or Update Substance Pills
function renderSubstancePillsBar() {
    const pillsBar = document.getElementById('substancePillsBar');
    if (!pillsBar) return;
    
    const subList = [
        { key: 'all', label: 'ทั้งหมด (9 รายการ)', icon: 'fa-flask' },
        { key: 'pesticide', label: 'ยาฆ่าแมลง', icon: 'fa-leaf' },
        { key: 'borax', label: 'สารบอแรกซ์', icon: 'fa-drumstick-bite' },
        { key: 'formalin', label: 'สารฟอร์มาลิน', icon: 'fa-fish' },
        { key: 'bleach', label: 'สารฟอกขาว', icon: 'fa-wand-magic-sparkles' },
        { key: 'salicylic', label: 'สารกันรา', icon: 'fa-seedling' },
        { key: 'agonist', label: 'สารเร่งเนื้อแดง', icon: 'fa-bacon' },
        { key: 'polar', label: 'สารโพลาร์', icon: 'fa-fire' },
        { key: 'coliformWater', label: 'โคลิฟอร์มในน้ำ', icon: 'fa-droplet' },
        { key: 'coliformFood', label: 'โคลิฟอร์มในอาหาร', icon: 'fa-bowl-food' },
    ];

    if (pillsBar.children.length === 0) {
        pillsBar.innerHTML = subList.map(item => `
            <button type="button" class="substance-pill-btn ${(window.currentActiveSubstance || 'all') === item.key ? 'active' : ''}" 
                    id="pill-sub-${item.key}" onclick="window.selectSubstanceAnalytics('${item.key}')">
                <i class="fa-solid ${item.icon}"></i>
                <span>${item.label}</span>
            </button>
        `).join('');
    } else {
        // Just update active classes
        subList.forEach(item => {
            const btn = document.getElementById('pill-sub-' + item.key);
            if (btn) {
                if ((window.currentActiveSubstance || 'all') === item.key) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }
}

// User Action: Select substance to view
window.selectSubstanceAnalytics = function(subKey) {
    window.currentActiveSubstance = subKey || 'all';
    
    // Sync dropdown
    const selectEl = document.getElementById('substanceAnalyticsSelect');
    if (selectEl && selectEl.value !== window.currentActiveSubstance) {
        selectEl.value = window.currentActiveSubstance;
    }
    
    // Sync pills
    renderSubstancePillsBar();
    
    // Re-render views
    if (window.currentCachedSamples && window.currentCachedStats) {
        updateModernSubstanceAnalyticsView(window.currentCachedSamples, window.currentCachedStats);
    }
};

// Open failed samples modal for current selected substance
window.openCurrentActiveSubstanceModal = function() {
    const key = window.currentActiveSubstance || 'all';
    let label = 'ทุกสารที่ตรวจวิเคราะห์';
    if (key !== 'all' && window.substanceDictionary[key]) {
        label = window.substanceDictionary[key].label;
    }
    window.openFailedSamplesModal(key, label);
};

// Main Modern Substance Analytics Renderer
function renderModernSubstanceAnalytics(samples, stats) {
    renderSubstancePillsBar();
    updateModernSubstanceAnalyticsView(samples, stats);
}

// Update the 3 widgets based on active substance
function updateModernSubstanceAnalyticsView(samples, stats) {
    const selectedKey = window.currentActiveSubstance || 'all';
    const subInfo = window.substanceDictionary[selectedKey] || { label: 'สารที่ตรวจทั้งหมด (9 รายการ)' };
    
    // Update badge in Business Stat
    const subBadge = document.getElementById('businessStatSubstanceBadge');
    if (subBadge) {
        subBadge.innerText = subInfo.label;
    }

    // Update monthly chart subtitle
    const monthlySubEl = document.getElementById('monthlyChartSubtitle');
    if (monthlySubEl) {
        monthlySubEl.innerText = selectedKey === 'all' 
            ? 'สารที่ตรวจทั้งหมด (9 รายการ) ปีงบประมาณ 2570 (ต.ค. 69 - ก.ย. 70)' 
            : subInfo.label + ' ปีงบประมาณ 2570 (ต.ค. 69 - ก.ย. 70)';
    }

    // =========================================================================
    // REQUIREMENT 1: Coast & Usage Bar Chart (12 Fiscal Months: ต.ค. 69 - ก.ย. 70)
    // =========================================================================
    const fiscalLabels = ['ต.ค. 69', 'พ.ย. 69', 'ธ.ค. 69', 'ม.ค. 70', 'ก.พ. 70', 'มี.ค. 70', 'เม.ย. 70', 'พ.ค. 70', 'มิ.ย. 70', 'ก.ค. 70', 'ส.ค. 70', 'ก.ย. 70'];
    const monthlyTotals = new Array(12).fill(0);
    const monthlyPass = new Array(12).fill(0);
    const monthlyFail = new Array(12).fill(0);

    (samples || []).forEach(s => {
        const rawDate = s.collection_date || s.sampling_date || (s.created_at ? s.created_at.split('T')[0] : '');
        const mIdx = getFiscalMonthIndex(rawDate);
        if (mIdx < 0 || mIdx > 11) return;

        let idx = 1;
        let hasItems = false;
        const checkSampleItem = (index) => {
            if (selectedKey !== 'all' && !window.itemMatchesSubstance(s, index, selectedKey)) return;
            hasItems = true;
            monthlyTotals[mIdx]++;

            const sum = window.getItemSubstanceSummary(s, index, selectedKey);
            if (sum && sum.includes('ไม่ผ่าน')) {
                monthlyFail[mIdx]++;
            } else if (sum && sum.includes('ผ่าน')) {
                monthlyPass[mIdx]++;
            } else if (s.status === 'approved') {
                monthlyPass[mIdx]++;
            }
        };

        while (s['sample_name_' + idx] !== undefined && idx <= 50) {
            if (s['item_status_' + idx] !== 'rejected') {
                checkSampleItem(idx);
            }
            idx++;
        }
        if (!hasItems && s.sample_name && s.status !== 'rejected') {
            checkSampleItem(null);
        }
    });

    // Summary calculation
    const totalYearCount = monthlyTotals.reduce((a, b) => a + b, 0);
    let maxMonthVal = 0;
    let peakMonthIdx = 0;
    monthlyTotals.forEach((val, i) => {
        if (val > maxMonthVal) {
            maxMonthVal = val;
            peakMonthIdx = i;
        }
    });
    const monthlyAvg = (totalYearCount / 12).toFixed(1);

    const totalEl = document.getElementById('substanceTotalYearCount');
    if (totalEl) totalEl.innerText = totalYearCount.toLocaleString() + ' ตัวอย่าง';

    const peakEl = document.getElementById('substancePeakMonth');
    if (peakEl) peakEl.innerText = totalYearCount > 0 ? `${fiscalLabels[peakMonthIdx]} (${maxMonthVal} ตัวอย่าง)` : '-';

    const avgEl = document.getElementById('substanceMonthlyAvg');
    if (avgEl) avgEl.innerText = monthlyAvg + ' ตัวอย่าง/เดือน';

    // Chart.js Bar + Spline Line
    const monthlyChartCanvas = document.getElementById('monthlySubstanceChart');
    if (monthlyChartCanvas) {
        const ctx = monthlyChartCanvas.getContext('2d');
        
        // Colors for 12 monthly pill bars (Image 2 Coast & Usage style)
        const barPalette = [
            '#38bdf8', '#0284c7', '#6366f1', '#8b5cf6', 
            '#a855f7', '#ec4899', '#f43f5e', '#f97316', 
            '#eab308', '#10b981', '#14b8a6', '#06b6d4'
        ];

        if (monthlySubstanceChartInstance) {
            monthlySubstanceChartInstance.data.labels = fiscalLabels;
            monthlySubstanceChartInstance.data.datasets[0].data = monthlyTotals;
            monthlySubstanceChartInstance.data.datasets[1].data = monthlyTotals;
            monthlySubstanceChartInstance.update();
        } else {
            monthlySubstanceChartInstance = new Chart(ctx, {
                data: {
                    labels: fiscalLabels,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'จำนวนตัวอย่างที่ตรวจ',
                            data: monthlyTotals,
                            backgroundColor: barPalette,
                            borderRadius: 12,
                            borderSkipped: false,
                            barPercentage: 0.52,
                            order: 2
                        },
                        {
                            type: 'line',
                            label: 'เส้นแนวโน้มการตรวจ',
                            data: monthlyTotals,
                            borderColor: '#0284c7',
                            borderWidth: 3,
                            tension: 0.42,
                            pointRadius: 5,
                            pointBackgroundColor: '#ffffff',
                            pointBorderColor: '#0284c7',
                            pointBorderWidth: 3,
                            pointHoverRadius: 8,
                            pointHoverBackgroundColor: '#0284c7',
                            pointHoverBorderColor: '#ffffff',
                            pointHoverBorderWidth: 3,
                            fill: false,
                            order: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: { top: 15, bottom: 5, left: 5, right: 5 }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            titleColor: '#f8fafc',
                            bodyColor: '#e2e8f0',
                            borderColor: '#334155',
                            borderWidth: 1,
                            cornerRadius: 12,
                            padding: 12,
                            titleFont: { family: "'Prompt', sans-serif", weight: 'bold', size: 13 },
                            bodyFont: { family: "'Prompt', sans-serif", size: 12 },
                            callbacks: {
                                title: function(items) {
                                    return 'ประจำเดือน ' + items[0].label;
                                },
                                label: function(context) {
                                    const idx = context.dataIndex;
                                    const t = monthlyTotals[idx] || 0;
                                    const p = monthlyPass[idx] || 0;
                                    const f = monthlyFail[idx] || 0;
                                    if (context.datasetIndex === 0) {
                                        return [
                                            ' ตรวจสะสม: ' + t + ' ตัวอย่าง',
                                            ' ผ่านเกณฑ์: ' + p + ' ตัวอย่าง',
                                            ' ไม่ผ่านเกณฑ์: ' + f + ' ตัวอย่าง'
                                        ];
                                    }
                                    return null;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                font: { family: "'Prompt', sans-serif", size: 11.5, weight: '500' },
                                color: '#475569'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            suggestedMax: 10,
                            grid: {
                                color: 'rgba(226, 232, 240, 0.8)',
                                borderDash: [5, 5]
                            },
                            ticks: {
                                font: { family: "'Prompt', sans-serif", size: 11 },
                                color: '#64748b',
                                precision: 0
                            }
                        }
                    }
                }
            });
        }
    }

    // =========================================================================
    // REQUIREMENT 3: Business STATISTIC (Concentric Rings + ผ่าน/ไม่ผ่าน ร้อยละ)
    // =========================================================================
    let bTotal = 0, bPass = 0, bFail = 0;
    if (selectedKey === 'all') {
        Object.values(stats).forEach(s => {
            bTotal += s.total;
            bPass += s.pass;
            bFail += s.fail;
        });
    } else if (stats[selectedKey]) {
        bTotal = stats[selectedKey].total;
        bPass = stats[selectedKey].pass;
        bFail = stats[selectedKey].fail;
    }

    const passPctVal = bTotal > 0 ? ((bPass / bTotal) * 100).toFixed(1) : '100.0';
    const failPctVal = bTotal > 0 ? ((bFail / bTotal) * 100).toFixed(1) : '0.0';

    // SVG concentric rings update
    // Circumference: Outer = 2 * PI * 62 = 389.5, Inner = 2 * PI * 44 = 276.4
    const passOffset = 389.5 * (1 - (parseFloat(passPctVal) / 100));
    const failOffset = 276.4 * (1 - (parseFloat(failPctVal) / 100));

    const passCircle = document.getElementById('concentricPassCircle');
    const failCircle = document.getElementById('concentricFailCircle');
    if (passCircle) passCircle.style.strokeDashoffset = passOffset;
    if (failCircle) failCircle.style.strokeDashoffset = failOffset;

    const ringCenterRate = document.getElementById('ringCenterPassRate');
    if (ringCenterRate) {
        ringCenterRate.innerText = '+' + passPctVal + '%';
    }

    const passPctEl = document.getElementById('businessStatPassPct');
    if (passPctEl) passPctEl.innerText = passPctVal + '%';

    const passCountEl = document.getElementById('businessStatPassCount');
    if (passCountEl) passCountEl.innerText = '(' + bPass.toLocaleString() + ' ตัวอย่าง)';

    const failPctEl = document.getElementById('businessStatFailPct');
    if (failPctEl) failPctEl.innerText = failPctVal + '%';

    const failCountEl = document.getElementById('businessStatFailCount');
    if (failCountEl) failCountEl.innerText = '(' + bFail.toLocaleString() + ' ตัวอย่าง)';

    // =========================================================================
    // REQUIREMENT 2: General Statistic (ตัวอย่างและจำนวนที่ไม่ผ่าน)
    // =========================================================================
    let failedItemsList = [];
    if (selectedKey === 'all') {
        for (const k in window.currentFailedSamples) {
            if (Array.isArray(window.currentFailedSamples[k])) {
                failedItemsList = failedItemsList.concat(window.currentFailedSamples[k]);
            }
        }
    } else {
        failedItemsList = window.currentFailedSamples[selectedKey] || [];
    }

    // Filter unique by sample name + date + province
    const uniqueFails = [];
    const seen = new Set();
    failedItemsList.forEach(s => {
        const id = (s.name || '') + (s.date || '') + (s.province || '');
        if (!seen.has(id)) {
            seen.add(id);
            uniqueFails.push(s);
        }
    });

    // Group counts by sample name
    const nameCounts = {};
    uniqueFails.forEach(s => {
        const n = s.name || 'ไม่ระบุชื่อตัวอย่าง';
        nameCounts[n] = (nameCounts[n] || 0) + 1;
    });

    const sortedNames = Object.keys(nameCounts).sort((a, b) => nameCounts[b] - nameCounts[a]);
    const totalFailedCount = uniqueFails.length;

    const failBadge = document.getElementById('generalStatFailBadge');
    if (failBadge) {
        failBadge.innerText = totalFailedCount + ' ตัวอย่าง';
        if (totalFailedCount > 0) {
            failBadge.style.background = '#fff1f2';
            failBadge.style.color = '#e11d48';
            failBadge.style.borderColor = '#fecdd3';
        } else {
            failBadge.style.background = '#ecfdf5';
            failBadge.style.color = '#059669';
            failBadge.style.borderColor = '#a7f3d0';
        }
    }

    const failedContainer = document.getElementById('failedSamplesListContainer');
    const modalBtn = document.getElementById('btnOpenSubstanceFailModal');

    if (failedContainer) {
        if (sortedNames.length === 0) {
            failedContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 26px 16px; background: #ffffff; border: 1.5px dashed #bbf7d0; border-radius: 14px; text-align: center;">
                    <div style="width: 42px; height: 42px; border-radius: 50%; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 8px;">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div style="font-size: 13.5px; font-weight: 700; color: #065f46; font-family: 'Prompt', sans-serif;">ไม่พบตัวอย่างที่ไม่ผ่านเกณฑ์</div>
                    <div style="font-size: 11.5px; color: #64748b; font-family: 'Prompt', sans-serif; margin-top: 2px;">ทุกตัวอย่างผ่านมาตรฐานความปลอดภัย (100%)</div>
                </div>
            `;
            if (modalBtn) {
                modalBtn.style.opacity = '0.6';
                modalBtn.style.cursor = 'default';
                modalBtn.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #059669;"></i> ทุกตัวอย่างผ่านมาตรฐานความปลอดภัย';
                modalBtn.onclick = null;
            }
        } else {
            failedContainer.innerHTML = sortedNames.map(name => {
                const count = nameCounts[name];
                const pct = totalFailedCount > 0 ? ((count / totalFailedCount) * 100).toFixed(1) : 0;
                return `
                    <div class="failed-sample-card">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="failed-sample-icon-box">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <div class="failed-sample-name">${name}</div>
                                <div class="failed-sample-sub">พบไม่ผ่านมาตรฐาน</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="failed-sample-badge-count">${count} ตัวอย่าง</span>
                            <span class="failed-sample-badge-pct">(${pct}%)</span>
                        </div>
                    </div>
                `;
            }).join('');

            if (modalBtn) {
                modalBtn.style.opacity = '1';
                modalBtn.style.cursor = 'pointer';
                modalBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass-chart"></i> ดูรายละเอียดตัวอย่างที่ไม่ผ่านทั้งหมด (${totalFailedCount} รายการ)`;
                modalBtn.onclick = window.openCurrentActiveSubstanceModal;
            }
        }
    }
}
