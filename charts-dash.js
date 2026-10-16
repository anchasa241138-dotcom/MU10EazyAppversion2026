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
                'โคลิฟอร์มในน้ำ',
                'ฉลากอาหาร'
            ],
            datasets: [
                {
                    label: 'ผ่านเกณฑ์',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(56, 189, 248, 0.85)',
                    borderColor: '#38bdf8',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: 'ไม่ผ่านเกณฑ์',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
    'all': { label: 'สารที่ตรวจวิเคราะห์ทั้งหมด (10 รายการ)', icon: 'fa-flask' },
    'pesticide': { label: 'ยาฆ่าแมลง', form: 'MU.10-001', icon: 'fa-leaf' },
    'borax': { label: 'สารบอแรกซ์', form: 'MU.10-002', icon: 'fa-drumstick-bite' },
    'formalin': { label: 'สารฟอร์มาลิน', form: 'MU.10-002', icon: 'fa-fish' },
    'bleach': { label: 'สารฟอกขาว', form: 'MU.10-002', icon: 'fa-wand-magic-sparkles' },
    'salicylic': { label: 'สารกันรา', form: 'MU.10-002', icon: 'fa-seedling' },
    'agonist': { label: 'สารเร่งเนื้อแดง', form: 'MU.10-002', icon: 'fa-bacon' },
    'polar': { label: 'สารโพลาร์ในน้ำมันทอดอาหาร', form: 'MU.10-003, 004', icon: 'fa-fire' },
    'coliformFood': { label: 'โคลิฟอร์มในอาหาร', form: 'MU.10-007', icon: 'fa-bowl-food' },
    'coliformWater': { label: 'โคลิฟอร์มในน้ำ', form: 'MU.10-006', icon: 'fa-droplet' },
    'foodLabel': { label: 'ฉลากอาหาร', form: 'MU.10-008', icon: 'fa-tag' }
};

window.itemMatchesSubstance = function(s, idx, targetSubstance) {
    if (!targetSubstance || targetSubstance === 'all') return true;
    if (targetSubstance === 'pesticide') return s.form_type === 'MU.10-001';
    if (targetSubstance === 'polar') return s.form_type === 'MU.10-003' || s.form_type === 'MU.10-004';
    if (targetSubstance === 'coliformWater') return s.form_type === 'MU.10-006';
    if (targetSubstance === 'coliformFood') return s.form_type === 'MU.10-007';
    if (targetSubstance === 'foodLabel') return s.form_type === 'MU.10-008';
    
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
        'foodLabel': { label: 'ฉลากอาหาร', total: 0, pass: 0, fail: 0 }
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
        } else if (s.form_type === 'MU.10-008') {
            const lblSum = (idx ? (s['label_summary_' + idx] || s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx]) : '')
                        || s.label_summary
                        || s.analysis_summary_outcome
                        || s.analysis_summary
                        || '';
            inc('foodLabel', lblSum.includes('ไม่ผ่าน') ? 'ไม่ผ่าน' : (lblSum.includes('ผ่าน') ? 'ผ่าน' : null));
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

    // Check if we need to build the DOM
    if (grid.children.length === 0) {
            

    for (const key in stats) {
        const item = stats[key];
            const col = document.createElement('div'); col.id = 'substance-col-' + key;
            col.style.cssText = 'background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); border-radius: 20px; padding: 18px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;';
            col.innerHTML = `
                  <h6 style="margin: 0 0 12px 0; font-weight: 700; color: #0f172a; text-align: center; font-size: 15px;">${item.label}</h6>
                  <div id="substance-text-${key}" style="width: 100%; margin-bottom: 12px;"></div>
                  <div style="position: relative; width: 100%; height: 180px; margin: 0 auto;">
                      <canvas id="substance-chart-${key}"></canvas>
                  </div>
                  <div id="substance-action-${key}" style="width: 100%; margin-top: 12px;"></div>
              `;
            grid.appendChild(col);
        }
    }

    // Now update charts
    for (const key in stats) {
        const colEl = document.getElementById('substance-col-' + key);
        if (colEl) {
            if (targetSubstance !== 'all' && targetSubstance !== key) {
                colEl.style.display = 'none';
            } else {
                colEl.style.display = 'flex';
                if (targetSubstance === key) {
                    colEl.style.border = '2px solid #2563eb';
                    colEl.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.18)';
                } else {
                    colEl.style.border = '1px solid #e2e8f0';
                    colEl.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                }
            }
        }
        const item = stats[key];
        const ctx = document.getElementById('substance-chart-' + key);
        if(!ctx) continue;
        
        const dataValues = [item.pass, item.fail];
        
        let viewBtn = item.fail > 0 
            ? `<button type="button" onclick="openFailedSamplesModal('${key}', '${item.label}')" style="width: 100%; padding: 8px; background-color: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; border-radius: 9999px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;"><i class="fa-solid fa-search"></i> ดูตัวอย่างที่ไม่ผ่าน</button>`
            : `<div style="height: 33px;"></div>`;
            
        const passPct = item.total > 0 ? ((item.pass / item.total) * 100).toFixed(1) : 0;
        const failPct = item.total > 0 ? ((item.fail / item.total) * 100).toFixed(1) : 0;
        
        const miniCardStyle = "display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 8px 8px; width: 31%; box-sizing: border-box; transition: transform 0.2s;";
        const iconStyle = "display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 10px; color: #fff; font-size: 14px; margin-right: 6px; flex-shrink: 0;";

        document.getElementById('substance-text-' + key).innerHTML = `
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #0284c7;"><i class="fa-solid fa-database"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 12px; color: #64748b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ตรวจ</div>
                        <div style="font-size: 16px; font-weight: bold; color: #0284c7;">${item.total}</div>
                    </div>
                </div>
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #059669;"><i class="fa-solid fa-check"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 12px; color: #64748b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ผ่าน</div>
                        <div style="font-size: 16px; font-weight: bold; color: #059669;">${item.pass} <span style="font-size: 11px; color: #64748b; font-weight: normal;">(${passPct}%)</span></div>
                    </div>
                </div>
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #e11d48;"><i class="fa-solid fa-xmark"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 12px; color: #64748b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ไม่ผ่าน</div>
                        <div style="font-size: 16px; font-weight: bold; color: #e11d48;">${item.fail} <span style="font-size: 11px; color: #64748b; font-weight: normal;">(${failPct}%)</span></div>
                    </div>
                </div>
            </div>
        `;

        const actionDiv = document.getElementById('substance-action-' + key);
        if (actionDiv) {
            actionDiv.innerHTML = viewBtn;
        }

        // Build failed samples breakdown pie chart
        let failedSamplesList = window.currentFailedSamples[key] || [];
        let uniqueFails = [];
        let seenFails = new Set();
        failedSamplesList.forEach(s => {
            let identifier = s.name + s.date + s.province;
            if(!seenFails.has(identifier)) {
                seenFails.add(identifier);
                uniqueFails.push(s);
            }
        });

        let nameCounts = {};
        uniqueFails.forEach(s => {
            let n = s.name || 'ไม่ระบุ';
            nameCounts[n] = (nameCounts[n] || 0) + 1;
        });
        
        let chartLabels = Object.keys(nameCounts).map(name => `${name} (${nameCounts[name]})`);
        let chartData = Object.values(nameCounts);
        let bgColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'];

        if (chartData.length === 0) {
            chartLabels = ['ไม่มีตัวอย่างที่ไม่ผ่าน'];
            chartData = [1];
            bgColors = ['#e2e8f0']; // Clean light gray ring
        }

        if (substanceChartInstances[key]) {
            substanceChartInstances[key].data.labels = chartLabels;
            substanceChartInstances[key].data.datasets[0].data = chartData;
            substanceChartInstances[key].data.datasets[0].backgroundColor = bgColors;
            substanceChartInstances[key].update();
        } else {
            substanceChartInstances[key] = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        data: chartData,
                        backgroundColor: bgColors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: { 
                            display: true,
                            position: 'bottom',
                            labels: { font: { family: 'Kanit', size: 11 }, usePointStyle: true, boxWidth: 6, padding: 8, color: '#64748b' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.label === 'ไม่มีตัวอย่างที่ไม่ผ่าน') return ' ไม่มีตัวอย่างที่ไม่ผ่าน';
                                    return ' ' + context.label + ' ตัวอย่าง';
                                }
                            }
                        }
                    }
                }
            });
        }
    }
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
    
    const samples = window.currentFailedSamples[key] || [];
    
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
