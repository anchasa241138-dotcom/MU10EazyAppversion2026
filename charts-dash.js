/**
 * SSKMOPH Dashboard Charts Configuration
 * Integrates Chart.js for data visualization across Region 10
 */

let provinceChartInstance = null;
let resultRatioChartInstance = null;
let formTypeChartInstance = null;

// Reusable canvas vertical gradient helper
function createBarGrad(ctx, c1, c2, h = 280) {
    if (!ctx) return c1;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
}
window.createChartGrad = createBarGrad;

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

    // 1. Province Chart (Bar Chart) - Vibrant Multi-tone Gradients with Dimensionality
    const grad1 = createBarGrad(provinceCtx, '#38bdf8', '#1d4ed8'); // ศรีสะเกษ (Sky to Royal Blue)
    const grad2 = createBarGrad(provinceCtx, '#22d3ee', '#0e7490'); // อุบลราชธานี (Cyan to Deep Teal)
    const grad3 = createBarGrad(provinceCtx, '#818cf8', '#4338ca'); // อำนาจเจริญ (Indigo to Deep Violet)
    const grad4 = createBarGrad(provinceCtx, '#a855f7', '#6d28d9'); // มุกดาหาร (Purple to Deep Plum)
    const grad5 = createBarGrad(provinceCtx, '#34d399', '#047857'); // ยโสธร (Emerald to Forest)

    provinceChartInstance = new Chart(provinceCtx, {
        type: 'bar',
        data: {
            labels: ['ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ', 'มุกดาหาร', 'ยโสธร'],
            datasets: [{
                label: 'จำนวนตัวอย่างตรวจวิเคราะห์แยกรายจังหวัด',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [grad1, grad2, grad3, grad4, grad5],
                borderColor: ['#38bdf8', '#22d3ee', '#818cf8', '#a855f7', '#34d399'],
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

    // 2. Result Ratio Chart (Doughnut Chart) - Luminous Gradient Slices
    const passDonutGrad = createBarGrad(resultRatioCtx, '#34d399', '#059669', 240); // Emerald to Forest
    const failDonutGrad = createBarGrad(resultRatioCtx, '#fb7185', '#e11d48', 240); // Rose to Ruby Crimson
    const pendingDonutGrad = createBarGrad(resultRatioCtx, '#fde047', '#d97706', 240); // Gold to Amber

    resultRatioChartInstance = new Chart(resultRatioCtx, {
        type: 'doughnut',
        data: {
            labels: ['ผ่านเกณฑ์มาตรฐาน', 'ไม่ผ่านเกณฑ์มาตรฐาน', 'รอการตรวจวิเคราะห์'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    passDonutGrad,
                    failDonutGrad,
                    pendingDonutGrad
                ],
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverOffset: 6,
                borderRadius: 6,
                spacing: 3
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

    // 3. Form Type Chart (Horizontal/Stacked Bar Chart) - Electric Gradients with Depth
    const formPassGrad = createBarGrad(formTypeCtx, '#38bdf8', '#0284c7', 280);
    const formFailGrad = createBarGrad(formTypeCtx, '#fb7185', '#e11d48', 280);

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
                    backgroundColor: formPassGrad,
                    borderColor: '#0284c7',
                    borderWidth: 1.5,
                    borderRadius: 6
                },
                {
                    label: 'ไม่ผ่านเกณฑ์',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: formFailGrad,
                    borderColor: '#e11d48',
                    borderWidth: 1.5,
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

    if (Array.isArray(samples)) {
        if (!window.allUnfilteredDatabaseSamples || samples.length >= window.allUnfilteredDatabaseSamples.length) {
            window.allUnfilteredDatabaseSamples = samples;
        }
    }

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

    // Sync active style on Substance Quick Filter (dropdown & chips)
    const curSub = subFilterEl ? subFilterEl.value : 'all';
    const rankSelect = document.getElementById('rankingSubstanceQuickSelect');
    if (rankSelect && rankSelect.value !== curSub) {
        rankSelect.value = curSub;
    }
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
        const rCtx = resultRatioChartInstance.ctx;
        const passGrad = createBarGrad(rCtx, '#34d399', '#059669', 240);
        const failGrad = createBarGrad(rCtx, '#fb7185', '#e11d48', 240);
        const pendingGrad = createBarGrad(rCtx, '#fde047', '#d97706', 240);

        resultRatioChartInstance.data.labels = ['ผ่านเกณฑ์มาตรฐาน', 'ไม่ผ่านเกณฑ์มาตรฐาน', 'รอการตรวจวิเคราะห์'];
        resultRatioChartInstance.data.datasets[0].data = [passed, failed, pending];
        resultRatioChartInstance.data.datasets[0].backgroundColor = [passGrad, failGrad, pendingGrad];
        resultRatioChartInstance.data.datasets[0].borderRadius = 6;
        resultRatioChartInstance.data.datasets[0].spacing = 3;
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

    // Call Strategic Modules (4 Dimensions)
    if (typeof updateStrategicKPITargets === 'function') {
        updateStrategicKPITargets(window.allUnfilteredDatabaseSamples || samples);
    }
    if (typeof updateTurnaroundTimeSLA === 'function') {
        updateTurnaroundTimeSLA(samples);
    }
    if (typeof updateCorrectiveActionGovernance === 'function') {
        updateCorrectiveActionGovernance(samples);
    }
    if (typeof updateLocationRiskAndFoodMatrix === 'function') {
        updateLocationRiskAndFoodMatrix(samples);
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
        const fCtx = formTypeChartInstance.ctx;
        formTypeChartInstance.data.datasets[0].backgroundColor = createBarGrad(fCtx, '#38bdf8', '#0284c7', 280);
        formTypeChartInstance.data.datasets[0].borderColor = '#0284c7';
        formTypeChartInstance.data.datasets[1].backgroundColor = createBarGrad(fCtx, '#fb7185', '#e11d48', 280);
        formTypeChartInstance.data.datasets[1].borderColor = '#e11d48';
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

// Permission Helper: Check if user can edit samples for a given province
window.canUserEditSample = function(sampleOrProvince) {
    const prov = (typeof sampleOrProvince === 'object' ? (sampleOrProvince.province || '') : (sampleOrProvince || '')).trim();
    let user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
    if (!user) {
        try {
            const sess = sessionStorage.getItem('sskmoph_session');
            if (sess) user = JSON.parse(sess);
        } catch(e){}
    }
    if (!user) return false;

    // Admin has oversight across all 5 provinces, can view details, but CANNOT record on behalf of provincial officers:
    // "ต้องการให้แอดมินติดตามผลการดำเนินงานหลังพบปัญหาทั้ง 5 จังหวัดได้ ดูรายละเอียดได้ แต่ไม่สามารถไปบันทึกแทนได้"
    if (user.role === 'admin' || user.username === 'admin') return false;

    // Provincial officers (สสจ., รพ., สสอ.) can ONLY edit their own province
    const uWp = (user.workplace || '').trim();
    const uProv = (user.province || '').trim();

    if (prov && uProv && uProv === prov) return true;
    if (prov && uWp && uWp.includes(prov)) return true;
    if (uWp.includes('เขต 10') || uWp.includes('ศวพ.10') || uWp.includes('ศูนย์วิทยาศาสตร์การแพทย์ที่ 10')) return true;

    return false;
};

window.getCurrentUserProvince = function() {
    let user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
    if (!user) {
        try {
            const sess = sessionStorage.getItem('sskmoph_session');
            if (sess) user = JSON.parse(sess);
        } catch(e){}
    }
    if (!user) return 'all';
    if (user.role === 'admin' || user.role === 'lab') return 'all';
    
    const provs = ['ศรีสะเกษ', 'อุบลราชธานี', 'ยโสธร', 'อำนาจเจริญ', 'มุกดาหาร'];
    const wp = (user.workplace || '') + ' ' + (user.province || '');
    for (const p of provs) {
        if (wp.includes(p)) return p;
    }
    return 'all';
};

window.filterFailedSamplesByProvince = function(prov) {
    window.currentFailedModalProvince = prov;
    const currentSubstanceLabel = document.getElementById('failedSubstanceName')?.innerText || 'ตัวอย่างไม่ผ่านเกณฑ์มาตรฐาน';
    window.openFailedSamplesModal(window.currentFailedModalKey || 'all', currentSubstanceLabel, prov);
};

// Global functions for modal
window.openFailedSamplesModal = function(key, label, provinceFilter) {
    window.currentFailedModalKey = key;
    document.getElementById('failedSubstanceName').innerText = label;
    const tbody = document.getElementById('failedSamplesTableBody');
    tbody.innerHTML = '';

    // Determine target province filter
    if (!provinceFilter) {
        if (!window.currentFailedModalProvince) {
            window.currentFailedModalProvince = window.getCurrentUserProvince();
        }
    } else {
        window.currentFailedModalProvince = provinceFilter;
    }
    const activeProv = window.currentFailedModalProvince || 'all';

    // Update Province Tabs in Modal
    document.querySelectorAll('#failedModalProvinceTabs .prov-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-prov') === activeProv) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Permission Badge text in Modal
    const user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
    const permNoteEl = document.getElementById('cad-perm-badge-txt');
    if (permNoteEl) {
        if (user && (user.role === 'admin' || user.role === 'lab')) {
            permNoteEl.innerHTML = `<strong>สิทธิ์ผู้ดูแลระบบ (Admin)</strong>: จัดการได้ทุกจังหวัด`;
        } else {
            const uProv = window.getCurrentUserProvince();
            if (uProv && uProv !== 'all') {
                permNoteEl.innerHTML = `<strong>สิทธิ์ประจำ จ.${uProv}</strong>: แก้ไขได้เฉพาะ จ.${uProv} (จังหวัดอื่นอ่านอย่างเดียว)`;
            } else {
                permNoteEl.innerHTML = `ตรวจสิทธิ์ตามจังหวัดผู้ใช้งาน`;
            }
        }
    }
    
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
        tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 20px;">ไม่พบข้อมูลตัวอย่างที่ไม่ผ่าน</td></tr>';
        const pieWrapper = document.getElementById('failedSamplesPieChart')?.parentElement?.parentElement;
        if(pieWrapper) pieWrapper.style.display = 'none';
    } else {
        // Use a Map or Set to prevent showing exact duplicates if a single sample has multiple sub-items failing the same substance (rare but possible)
        let uniqueSamples = [];
        let seen = new Set();
        samples.forEach(s => {
            let identifier = s.code || (s.name + s.date + s.province);
            if(!seen.has(identifier)) {
                seen.add(identifier);
                s.identifier = identifier;
                uniqueSamples.push(s);
            }
        });

        // Filter by active province tab if not 'all'
        let displaySamples = uniqueSamples;
        if (activeProv !== 'all') {
            displaySamples = uniqueSamples.filter(s => s.province === activeProv);
        }

        // Aggregate counts for pie chart
        let nameCounts = {};
        displaySamples.forEach(s => {
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
                            borderWidth: 2.5,
                            borderColor: '#ffffff',
                            borderRadius: 5,
                            spacing: 2,
                            hoverOffset: 4
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

        if (displaySamples.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 25px; color: #64748b;">ไม่พบตัวอย่างไม่ผ่านเกณฑ์ใน จ.${activeProv}</td></tr>`;
        } else {
            const actionLabels = {
                pending: '🟡 อยู่ระหว่างติดตาม',
                warned: '🔵 ตักเตือน/แนะนำ',
                seized: '🟠 อายัด/ทำลายสินค้า',
                fined: '🔴 ดำเนินคดี/ปรับ',
                retested_passed: '🟢 สุ่มตรวจซ้ำผ่าน'
            };

            displaySamples.forEach((s, idx) => {
                let tr = document.createElement('tr');
                const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                tr.style.backgroundColor = rowBg;
                tr.style.borderBottom = '1px solid #e2e8f0';
                tr.style.transition = 'background-color 0.2s';
                tr.onmouseover = () => tr.style.backgroundColor = '#f1f5f9';
                tr.onmouseout = () => tr.style.backgroundColor = rowBg;

                const idKey = s.identifier || s.code || (s.name + s.date + s.province);
                const curDetail = window.getSampleActionDetail ? window.getSampleActionDetail(idKey) : { status: 'pending' };
                const curAction = curDetail.status || 'pending';
                const hasDetail = Boolean(curDetail.notes || curDetail.actionDate || curDetail.officer);
                const canEdit = window.canUserEditSample(s.province);

                tr.innerHTML = `
                    <td style="padding: 12px 14px;">
                        <div style="font-weight: 600; color: #0f172a;">${s.name || '-'}</div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 2px;"><i class="fa-solid fa-barcode"></i> ${s.code || '-'}</div>
                    </td>
                    <td style="padding: 12px 14px; color: #334155;">${s.date ? new Date(s.date).toLocaleDateString('th-TH') : '-'}</td>
                    <td style="padding: 12px 14px;">
                        <div style="color: #0f172a; font-weight: 500;">${s.source || '-'}</div>
                        <div style="font-size: 13px; color: #64748b; margin-top: 2px;"><i class="fa-solid fa-location-dot"></i> ${s.location || '-'}</div>
                    </td>
                    <td style="padding: 12px 14px;">
                        <div style="color: #0f172a;">อ.${s.district || '-'}</div>
                        <div style="font-size: 13px; color: #64748b; margin-top: 2px;">จ.${s.province || '-'}</div>
                    </td>
                    <td style="padding: 12px 14px;">
                        <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 700; border: 1px solid #bae6fd; white-space: nowrap;">
                            ${s.form_type || '-'}
                        </span>
                    </td>
                    <td style="padding: 12px 14px;">
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            ${canEdit ? `
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <select class="action-status-select status-${curAction}" onchange="window.updateSampleAction('${idKey}', this.value); this.className='action-status-select status-'+this.value;" style="flex: 1;">
                                        <option value="pending" ${curAction === 'pending' ? 'selected' : ''}>🟡 อยู่ระหว่างติดตาม</option>
                                        <option value="warned" ${curAction === 'warned' ? 'selected' : ''}>🔵 ตักเตือน/แนะนำ</option>
                                        <option value="seized" ${curAction === 'seized' ? 'selected' : ''}>🟠 อายัด/ทำลายสินค้า</option>
                                        <option value="fined" ${curAction === 'fined' ? 'selected' : ''}>🔴 ดำเนินคดี/ปรับ</option>
                                        <option value="retested_passed" ${curAction === 'retested_passed' ? 'selected' : ''}>🟢 สุ่มตรวจซ้ำผ่าน</option>
                                    </select>
                                    <button type="button" class="btn-action-detail" title="บันทึกรายละเอียดการติดตามผล" onclick="window.openCorrectiveDetailModal('${idKey}', false)">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                            ` : `
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div class="action-status-badge status-${curAction} readonly" style="flex: 1; padding: 6px 10px; border-radius: 8px; font-size: 12.5px; font-weight: 600; display: flex; align-items: center; justify-content: space-between;" title="เฉพาะผู้รับผิดชอบ จ.${s.province || '-'}">
                                        <span>${actionLabels[curAction] || curAction}</span>
                                        <i class="fa-solid fa-lock" style="font-size: 10px; opacity: 0.65;" title="สิทธิ์การแก้ไขเฉพาะเจ้าหน้าที่ จ.${s.province || '-'}"></i>
                                    </div>
                                    <button type="button" class="btn-action-detail readonly-btn" title="ดูรายละเอียดบันทึกผล (โหมดอ่านอย่างเดียว)" onclick="window.openCorrectiveDetailModal('${idKey}', true)">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                </div>
                            `}
                            ${hasDetail ? `
                                <div style="font-size: 11.5px; color: #0369a1; background: #f0f9ff; border: 1px solid #bae6fd; padding: 4px 8px; border-radius: 6px; line-height: 1.4;">
                                    <strong><i class="fa-solid fa-clipboard-check"></i> ${curDetail.actionDate ? new Date(curDetail.actionDate).toLocaleDateString('th-TH') : 'บันทึกแล้ว'}:</strong> 
                                    ${curDetail.notes ? (curDetail.notes.length > 28 ? curDetail.notes.substring(0, 28) + '...' : curDetail.notes) : (curDetail.officer || 'มีการบันทึกข้อมูล')}
                                </div>
                            ` : ''}
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
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
    const rankSelect = document.getElementById('rankingSubstanceQuickSelect');
    if (rankSelect && rankSelect.value !== substanceKey) {
        rankSelect.value = substanceKey;
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
        
        // 12 Rich Multi-stop Gradients for Monthly Pill Bars
        const monthGradients = [
            createBarGrad(ctx, '#38bdf8', '#0284c7', 280), // ต.ค. (Sky -> Ocean)
            createBarGrad(ctx, '#60a5fa', '#2563eb', 280), // พ.ย. (Blue -> Royal)
            createBarGrad(ctx, '#818cf8', '#4f46e5', 280), // ธ.ค. (Indigo -> Deep)
            createBarGrad(ctx, '#a78bfa', '#7c3aed', 280), // ม.ค. (Violet -> Purple)
            createBarGrad(ctx, '#c084fc', '#9333ea', 280), // ก.พ. (Fuchsia -> Purple)
            createBarGrad(ctx, '#f472b6', '#db2777', 280), // มี.ค. (Pink -> Rose)
            createBarGrad(ctx, '#fb7185', '#e11d48', 280), // เม.ย. (Rose -> Crimson)
            createBarGrad(ctx, '#fb923c', '#ea580c', 280), // พ.ค. (Orange -> Rust)
            createBarGrad(ctx, '#facc15', '#d97706', 280), // มิ.ย. (Amber -> Gold)
            createBarGrad(ctx, '#34d399', '#059669', 280), // ก.ค. (Emerald -> Forest)
            createBarGrad(ctx, '#2dd4bf', '#0d9488', 280), // ส.ค. (Teal -> Jade)
            createBarGrad(ctx, '#22d3ee', '#0891b2', 280)  // ก.ย. (Cyan -> Deep Cyan)
        ];
        const monthBorders = [
            '#0284c7', '#2563eb', '#4f46e5', '#7c3aed',
            '#9333ea', '#db2777', '#e11d48', '#ea580c',
            '#d97706', '#059669', '#0d9488', '#0891b2'
        ];

        // Luminous Spline Area Fill Gradient
        const splineAreaGrad = ctx.createLinearGradient(0, 0, 0, 260);
        splineAreaGrad.addColorStop(0, 'rgba(2, 132, 199, 0.28)');
        splineAreaGrad.addColorStop(0.65, 'rgba(2, 132, 199, 0.08)');
        splineAreaGrad.addColorStop(1, 'rgba(2, 132, 199, 0.00)');

        if (monthlySubstanceChartInstance) {
            monthlySubstanceChartInstance.data.labels = fiscalLabels;
            monthlySubstanceChartInstance.data.datasets[0].data = monthlyTotals;
            monthlySubstanceChartInstance.data.datasets[0].backgroundColor = monthGradients;
            monthlySubstanceChartInstance.data.datasets[0].borderColor = monthBorders;
            monthlySubstanceChartInstance.data.datasets[1].data = monthlyTotals;
            monthlySubstanceChartInstance.data.datasets[1].backgroundColor = splineAreaGrad;
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
                            backgroundColor: monthGradients,
                            borderColor: monthBorders,
                            borderWidth: 1.5,
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
                            borderWidth: 3.5,
                            tension: 0.42,
                            pointRadius: 5.5,
                            pointBackgroundColor: '#ffffff',
                            pointBorderColor: '#0284c7',
                            pointBorderWidth: 3,
                            pointHoverRadius: 8.5,
                            pointHoverBackgroundColor: '#0284c7',
                            pointHoverBorderColor: '#ffffff',
                            pointHoverBorderWidth: 3,
                            fill: true,
                            backgroundColor: splineAreaGrad,
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


/* ==========================================================================
   STRATEGIC EXECUTIVE MODULES (4 DIMENSIONS) IMPLEMENTATION
   ========================================================================== */

// 1. STRATEGIC TARGETS (มิติที่ 1: แผนยุทธศาสตร์และเป้าหมาย)
window.STRATEGIC_TARGETS_2570 = {
    total: 5245,
    chemical: 4895,
    microbiology: 350,
    provinces: {
        'อุบลราชธานี': { chemical: 1630, micro: 120, total: 1750, id: 'ubon' },
        'ศรีสะเกษ': { chemical: 1430, micro: 110, total: 1540, id: 'sisaket' },
        'มุกดาหาร': { chemical: 630, micro: 40, total: 670, id: 'muk' },
        'อำนาจเจริญ': { chemical: 630, micro: 40, total: 670, id: 'amnat' },
        'ยโสธร': { chemical: 575, micro: 40, total: 615, id: 'yasothon' }
    }
};

function updateStrategicKPITargets(allSamples) {
    if (!Array.isArray(allSamples)) return;
    const targetConfig = window.STRATEGIC_TARGETS_2570;

    // Total Region 10
    const totalActual = allSamples.length;
    const totalTarget = targetConfig.total;
    const totalPct = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : '0.0';

    const totalCountEl = document.getElementById('kpi-total-actual-count');
    const totalPctEl = document.getElementById('kpi-total-actual-pct');
    const totalBarEl = document.getElementById('kpi-total-progress-bar');

    if (totalCountEl) totalCountEl.innerText = `${totalActual.toLocaleString()} / ${totalTarget.toLocaleString()} ตัวอย่าง`;
    if (totalPctEl) totalPctEl.innerText = `${totalPct}%`;
    if (totalBarEl) {
        totalBarEl.style.width = `${Math.min(parseFloat(totalPct), 100)}%`;
        if (parseFloat(totalPct) >= 80) {
            totalBarEl.style.background = 'linear-gradient(90deg, #34d399 0%, #059669 100%)';
        } else if (parseFloat(totalPct) >= 50) {
            totalBarEl.style.background = 'linear-gradient(90deg, #facc15 0%, #d97706 100%)';
        } else {
            totalBarEl.style.background = 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)';
        }
    }

    // 5 Provinces
    for (const provName in targetConfig.provinces) {
        const pInfo = targetConfig.provinces[provName];
        const pSamples = allSamples.filter(s => s.province === provName || (s.agency && s.agency.includes(provName)));
        const actualCount = pSamples.length;
        const target = pInfo.total;
        const pct = target > 0 ? ((actualCount / target) * 100).toFixed(1) : '0.0';

        const actualEl = document.getElementById(`pt-actual-${pInfo.id}`);
        const pctEl = document.getElementById(`pt-pct-${pInfo.id}`);
        const fillEl = document.getElementById(`pt-fill-${pInfo.id}`);
        const statusEl = document.getElementById(`pt-status-${pInfo.id}`);

        if (actualEl) actualEl.innerText = actualCount.toLocaleString();
        if (pctEl) pctEl.innerText = `${pct}%`;
        if (fillEl) {
            fillEl.style.width = `${Math.min(parseFloat(pct), 100)}%`;
            fillEl.className = 'pt-fill ' + (parseFloat(pct) >= 80 ? 'fill-success' : (parseFloat(pct) >= 50 ? 'fill-warning' : 'fill-danger'));
        }
        if (statusEl) {
            if (parseFloat(pct) >= 80) {
                statusEl.className = 'pt-status-pill pill-success';
                statusEl.innerText = 'ตามเป้าหมาย';
            } else if (parseFloat(pct) >= 50) {
                statusEl.className = 'pt-status-pill pill-warning';
                statusEl.innerText = 'ปานกลาง';
            } else {
                statusEl.className = 'pt-status-pill pill-danger';
                statusEl.innerText = 'ต้องเร่งรัด';
            }
        }
    }
}
window.updateStrategicKPITargets = updateStrategicKPITargets;


// 2. TURNAROUND TIME & SLA MONITORING (มิติที่ 2: TAT 72 ชั่วโมง)
window.currentOverdueSamples = [];

function updateTurnaroundTimeSLA(samples) {
    if (!Array.isArray(samples)) return;
    const now = new Date();
    let totalCompletedDays = 0;
    let completedCount = 0;
    let withinSLACount = 0;
    window.currentOverdueSamples = [];

    samples.forEach(s => {
        // วันที่รับตัวอย่างเข้าแลป (Lab Receive Date/Timestamp)
        const rawRecDate = s.lab_receive_timestamp || s.lab_receive_date || s.created_at;
        if (!rawRecDate) return;
        const recDate = new Date(rawRecDate);
        if (isNaN(recDate.getTime())) return;

        // คำนวณจากวันที่รับตัวอย่างจนถึงผู้รับรองอนุมัติลงนาม (Approved)
        const isApproved = s.status === 'approved' || !!s.approved_timestamp || !!s.approved_date;
        if (isApproved) {
            // วันที่ผู้รับรองอนุมัติลงนาม
            const rawApproveDate = s.approved_timestamp || s.approved_date || s.analysis_timestamp || s.analysis_date || s.updated_at || s.created_at;
            const approveDate = new Date(rawApproveDate);
            let diffDays = 0;
            if (!isNaN(approveDate.getTime()) && approveDate >= recDate) {
                diffDays = (approveDate.getTime() - recDate.getTime()) / (1000 * 60 * 60 * 24);
            } else {
                diffDays = 1.0;
            }
            diffDays = Math.max(0.5, Math.min(diffDays, 14));
            totalCompletedDays += diffDays;
            completedCount++;
            if (diffDays <= 3.0) {
                withinSLACount++;
            }
        } else {
            // ยังไม่อนุมัติลงนาม (อยู่ระหว่างรับตัวอย่าง/กำลังตรวจ/รอนักวิทย์ลงนาม/รอผู้รับรองอนุมัติ)
            const elapsedDays = (now.getTime() - recDate.getTime()) / (1000 * 60 * 60 * 24);
            if (elapsedDays > 3.0) {
                let statusTh = 'รอรับตัวอย่าง';
                if (s.status === 'accepted' || s.status === 'received') statusTh = 'รับตัวอย่างแล้ว (รอตรวจ)';
                else if (s.status === 'analyzing') statusTh = 'กำลังตรวจวิเคราะห์';
                else if (s.status === 'summarized') statusTh = 'สรุปผลแล้ว (รอนักวิทย์ลงนาม)';
                else if (s.status === 'analyst_signed') statusTh = 'นักวิทย์ลงนามแล้ว (รอผู้รับรองอนุมัติ)';

                window.currentOverdueSamples.push({
                    code: s.lab_no || s.lab_id || s.sample_id || s.ref_id || '-',
                    name: s.sample_name || s.sample_name_1 || 'คำขอตรวจวิเคราะห์',
                    receiveDate: recDate.toLocaleDateString('th-TH'),
                    elapsedDays: elapsedDays.toFixed(1),
                    elapsedHours: Math.round(elapsedDays * 24),
                    agency: s.agency || s.source || '-',
                    province: s.province || '-',
                    status: statusTh
                });
            }
        }
    });

    const avgDays = completedCount > 0 ? (totalCompletedDays / completedCount).toFixed(1) : '2.1';
    const slaRate = completedCount > 0 ? ((withinSLACount / completedCount) * 100).toFixed(1) + '%' : '100%';
    const overdueCount = window.currentOverdueSamples.length;

    // Calculate Overdue Rate (% ค้างท่อ นับเป็นฉบับ)
    const totalTrackedForms = (samples.filter(s => !!(s.lab_receive_date || s.lab_receive_timestamp || s.created_at)).length) || (completedCount + overdueCount);
    let overduePct = '0.0%';
    if (overdueCount > 0) {
        const slaNum = completedCount > 0 ? (withinSLACount / completedCount) * 100 : 100;
        const breachRate = Math.max(0, 100 - slaNum);
        if (breachRate > 0) {
            overduePct = breachRate.toFixed(1) + '%';
        } else if (totalTrackedForms > 0) {
            overduePct = ((overdueCount / totalTrackedForms) * 100).toFixed(1) + '%';
        } else {
            overduePct = '0.0%';
        }
    }
    window.currentOverduePct = overduePct;

    const avgEl = document.getElementById('tat-avg-days');
    const rateEl = document.getElementById('tat-sla-rate');
    const overdueEl = document.getElementById('tat-overdue-count');
    const alertContainer = document.getElementById('tat-alert-container');

    if (avgEl) avgEl.innerText = `${avgDays} วัน`;
    if (rateEl) {
        rateEl.innerText = slaRate;
        rateEl.style.color = parseFloat(slaRate) >= 90 ? '#10b981' : '#f59e0b';
    }
    const slaLabelEl = document.getElementById('tat-sla-label');
    if (slaLabelEl) {
        slaLabelEl.innerHTML = completedCount > 0 
            ? `ทันตามกำหนด <span style="font-size: 11px; opacity: 0.85;">(${withinSLACount}/${completedCount} ฉบับ)</span>`
            : 'ทันตามกำหนด (On-Time)';
    }
    if (overdueEl) {
        if (overdueCount > 0) {
            overdueEl.innerHTML = `<span>${overduePct}</span> <span class="unit-sub">(${overdueCount} ฉบับ)</span>`;
            overdueEl.style.color = '#ef4444';
        } else {
            overdueEl.innerHTML = `<span>0.0%</span> <span class="unit-sub">(0 ฉบับ)</span>`;
            overdueEl.style.color = '#10b981';
        }
    }

    if (alertContainer) {
        if (overdueCount > 0) {
            alertContainer.innerHTML = `
                <div class="ops-alert-banner alert-danger">
                    <span><i class="fa-solid fa-triangle-exclamation"></i> พบคำขอตรวจที่รอนานเกิน 3 วัน (ค้างท่อ) จำนวน <strong>${overdueCount} ฉบับ</strong> (คิดเป็น <strong>${overduePct}</strong>)</span>
                    <button type="button" class="btn-view-overdue" onclick="window.openOverdueSamplesModal()">
                        <i class="fa-solid fa-magnifying-glass"></i> ดูคำขอค้างท่อ (${overdueCount} ฉบับ)
                    </button>
                </div>
            `;
        } else {
            alertContainer.innerHTML = `
                <div class="ops-alert-banner alert-success">
                    <span><i class="fa-solid fa-circle-check"></i> คำขอตรวจทุกฉบับตรวจเสร็จทันตามเกณฑ์มาตรฐาน 3 วัน (ไม่พบค้างท่อ 0.0%)</span>
                </div>
            `;
        }
    }
}
window.updateTurnaroundTimeSLA = updateTurnaroundTimeSLA;

// Overdue Modal Control
window.openOverdueSamplesModal = function() {
    const tbody = document.getElementById('overdueSamplesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const list = window.currentOverdueSamples || [];
    const modalSubtitle = document.getElementById('overdueModalSubtitle');
    if (modalSubtitle) {
        modalSubtitle.innerHTML = `รายการคำขอตรวจที่รอนานเกิน 3 วัน (72 ชม.) จำนวน <strong>${list.length} ฉบับ</strong> (${window.currentOverduePct || '0.0%'})`;
    }
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 25px; color: #10b981;"><i class="fa-solid fa-circle-check"></i> ไม่พบคำขอตรวจค้างท่อเกินเกณฑ์มาตรฐาน 3 วัน</td></tr>';
    } else {
        list.forEach((s, idx) => {
            const tr = document.createElement('tr');
            tr.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
            tr.style.borderBottom = '1px solid #e2e8f0';
            tr.innerHTML = `
                <td style="padding: 12px 14px;">
                    <div style="font-weight: 700; color: #0f172a;">${s.name}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;"><i class="fa-solid fa-barcode"></i> ${s.code}</div>
                </td>
                <td style="padding: 12px 14px; color: #334155;">${s.receiveDate}</td>
                <td style="padding: 12px 14px;">
                    <span style="color: #dc2626; font-weight: 700; background: #fee2e2; padding: 3px 8px; border-radius: 6px;">
                        ค้าง ${s.elapsedDays} วัน (${s.elapsedHours} ชม.)
                    </span>
                </td>
                <td style="padding: 12px 14px;">
                    <div style="font-weight: 600; color: #1e293b;">${s.agency}</div>
                    <div style="font-size: 12px; color: #64748b;">จ.${s.province}</div>
                </td>
                <td style="padding: 12px 14px;">
                    <span style="background: #fef9c3; color: #854d0e; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">
                        ${s.status}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    document.getElementById('overdueSamplesModal')?.classList.add('active');
};

window.closeOverdueSamplesModal = function() {
    document.getElementById('overdueSamplesModal')?.classList.remove('active');
};


// 3. CORRECTIVE ACTION GOVERNANCE (มิติที่ 5: การติดตามผลหลังพบปัญหา)
window.getStoredCorrectiveActions = function() {
    try {
        return JSON.parse(localStorage.getItem('sskmoph_corrective_actions') || '{}');
    } catch(e) {
        return {};
    }
};

window.getSampleActionDetail = function(identifier) {
    const actions = window.getStoredCorrectiveActions();
    const item = actions[identifier];
    if (!item) {
        return {
            status: 'pending',
            actionDate: '',
            officer: '',
            notes: '',
            isClosed: false,
            updatedAt: null
        };
    }
    if (typeof item === 'string') {
        return {
            status: item,
            actionDate: '',
            officer: '',
            notes: '',
            isClosed: item !== 'pending',
            updatedAt: null
        };
    }
    return item;
};

window.getSampleAction = function(identifier) {
    const detail = window.getSampleActionDetail(identifier);
    return detail.status || 'pending';
};

window.saveCorrectiveActionDetail = function(identifier, data) {
    // Find target sample province
    let targetProv = '';
    for (const k in window.currentFailedSamples) {
        if (Array.isArray(window.currentFailedSamples[k])) {
            const match = window.currentFailedSamples[k].find(s => (s.identifier === identifier || s.code === identifier || (s.name + s.date + s.province) === identifier));
            if (match) {
                targetProv = match.province;
                break;
            }
        }
    }

    if (targetProv && !window.canUserEditSample(targetProv)) {
        let user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
        if (!user) {
            try {
                const sess = sessionStorage.getItem('sskmoph_session');
                if (sess) user = JSON.parse(sess);
            } catch(e){}
        }
        const isAdmin = user && (user.role === 'admin' || user.username === 'admin');
        const warnMsg = isAdmin 
            ? `สิทธิ์ผู้ดูแลระบบ (Admin) สามารถติดตามดูข้อมูลได้เท่านั้น ไม่สามารถบันทึกหรือแก้ไขข้อมูลแทนเจ้าหน้าที่ประจำจังหวัดได้`
            : `คุณไม่มีสิทธิ์แก้ไขข้อมูลของ จ.${targetProv} (สิทธิ์เฉพาะเจ้าหน้าที่ประจำจังหวัดเท่านั้น)`;
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่มีสิทธิ์บันทึกข้อมูล',
                text: warnMsg
            });
        } else {
            alert(warnMsg);
        }
        return false;
    }

    try {
        const actions = window.getStoredCorrectiveActions();
        actions[identifier] = {
            status: data.status || 'pending',
            actionDate: data.actionDate || new Date().toISOString().split('T')[0],
            officer: data.officer || '',
            notes: data.notes || '',
            isClosed: Boolean(data.isClosed),
            updatedAt: new Date().toISOString(),
            updatedBy: (window.app && window.app.currentUser) ? window.app.currentUser.fullname : 'ผู้รับผิดชอบ'
        };
        localStorage.setItem('sskmoph_corrective_actions', JSON.stringify(actions));
        // Sync with Firebase if available
        if (typeof db !== 'undefined' && db.ref) {
            try { 
                const cleanKey = identifier.replace(/[.#$/[\]]/g, '_');
                db.ref('corrective_actions/' + cleanKey).set(actions[identifier]); 
            } catch(e){}
        }
        if (window.currentCachedSamples) {
            updateCorrectiveActionGovernance(window.currentCachedSamples);
        }
        if (typeof window.renderFollowupPageView === 'function') {
            window.renderFollowupPageView();
        }
        if (window.app && typeof window.app.updateBadges === 'function') {
            window.app.updateBadges();
        }
        return true;
    } catch(e) {
        console.error('Error saving action detail:', e);
        return false;
    }
};

window.updateSampleAction = function(identifier, newStatus) {
    // Find target sample province
    let targetProv = '';
    for (const k in window.currentFailedSamples) {
        if (Array.isArray(window.currentFailedSamples[k])) {
            const match = window.currentFailedSamples[k].find(s => (s.identifier === identifier || s.code === identifier || (s.name + s.date + s.province) === identifier));
            if (match) {
                targetProv = match.province;
                break;
            }
        }
    }

    if (targetProv && !window.canUserEditSample(targetProv)) {
        let user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
        if (!user) {
            try {
                const sess = sessionStorage.getItem('sskmoph_session');
                if (sess) user = JSON.parse(sess);
            } catch(e){}
        }
        const isAdmin = user && (user.role === 'admin' || user.username === 'admin');
        const warnMsg = isAdmin 
            ? `สิทธิ์ผู้ดูแลระบบ (Admin) สามารถติดตามดูข้อมูลได้เท่านั้น ไม่สามารถบันทึกหรือแก้ไขข้อมูลแทนเจ้าหน้าที่ประจำจังหวัดได้`
            : `คุณไม่มีสิทธิ์แก้ไขข้อมูลของ จ.${targetProv} (สิทธิ์เฉพาะเจ้าหน้าที่ประจำจังหวัดเท่านั้น)`;
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่มีสิทธิ์แก้ไข',
                text: warnMsg
            });
        }
        const currentSubstanceLabel = document.getElementById('failedSubstanceName')?.innerText || 'ตัวอย่างไม่ผ่านเกณฑ์มาตรฐาน';
        window.openFailedSamplesModal(window.currentFailedModalKey || 'all', currentSubstanceLabel, window.currentFailedModalProvince || 'all');
        return;
    }

    try {
        const existing = window.getSampleActionDetail(identifier);
        window.saveCorrectiveActionDetail(identifier, {
            status: newStatus,
            actionDate: existing.actionDate || new Date().toISOString().split('T')[0],
            officer: existing.officer || ((window.app && window.app.currentUser) ? window.app.currentUser.fullname : ''),
            notes: existing.notes || '',
            isClosed: newStatus !== 'pending'
        });
    } catch(e) {
        console.error('Error saving action status:', e);
    }
};

function updateCorrectiveActionGovernance(samples) {
    const actions = window.getStoredCorrectiveActions();
    
    // Gather all unique failed samples
    let allFailedIdentifiers = new Set();
    for (const k in window.currentFailedSamples) {
        if (k !== 'all' && Array.isArray(window.currentFailedSamples[k])) {
            window.currentFailedSamples[k].forEach(s => {
                const id = s.code || (s.name + s.date + s.province);
                allFailedIdentifiers.add(id);
            });
        }
    }

    const totalFailed = allFailedIdentifiers.size;
    let counts = {
        pending: 0,
        warned: 0,
        seized: 0,
        fined: 0,
        retested_passed: 0
    };

    allFailedIdentifiers.forEach(id => {
        const item = actions[id];
        let st = 'pending';
        if (typeof item === 'string') {
            st = item;
        } else if (item && typeof item === 'object') {
            st = item.status || 'pending';
        }
        if (counts[st] !== undefined) counts[st]++;
        else counts.pending++;
    });

    const failEl = document.getElementById('action-total-fail');
    const closedEl = document.getElementById('action-closed-pct');
    const pendEl = document.getElementById('action-pending-pct');
    const barEl = document.getElementById('action-closed-bar');
    const btnFailCount = document.getElementById('btn-action-fail-count');
    const btnManage = document.querySelector('.btn-manage-actions');
    const badgeAllPassed = document.getElementById('action-all-passed-badge');
    const badgeAllPassedTxt = document.getElementById('action-all-passed-txt');
    const btnActionLabelTxt = document.getElementById('btn-action-label-txt');

    const filterEl = document.getElementById('dashProvinceFilter');
    const activeProv = (filterEl && filterEl.value !== 'all') ? filterEl.value : '';

    let user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
    if (!user) {
        try {
            const sess = sessionStorage.getItem('sskmoph_session');
            if (sess) user = JSON.parse(sess);
        } catch(e){}
    }
    const isAdmin = Boolean(user && (user.role === 'admin' || user.username === 'admin'));

    if (totalFailed > 0) {
        const closedCount = counts.warned + counts.seized + counts.fined + counts.retested_passed;
        const closedPct = ((closedCount / totalFailed) * 100).toFixed(1);
        const pendingPct = ((counts.pending / totalFailed) * 100).toFixed(1);

        if (failEl) failEl.innerText = totalFailed;
        if (closedEl) closedEl.innerText = `${closedPct}%`;
        if (pendEl) pendEl.innerText = `${pendingPct}%`;
        if (barEl) {
            barEl.style.width = `${Math.min(parseFloat(closedPct), 100)}%`;
        }

        if (btnManage) btnManage.style.display = isAdmin ? 'none' : 'inline-flex';
        if (badgeAllPassed) badgeAllPassed.style.display = 'none';
        if (btnFailCount) btnFailCount.innerText = totalFailed;
        if (btnActionLabelTxt) {
            btnActionLabelTxt.innerText = activeProv ? `จัดการและบันทึกติดตามผล จ.${activeProv}` : 'จัดการและบันทึกติดตามผล';
        }
    } else {
        if (failEl) failEl.innerText = '0';
        if (closedEl) closedEl.innerText = '-';
        if (pendEl) pendEl.innerText = '-';
        if (barEl) barEl.style.width = '0%';

        if (btnManage) btnManage.style.display = 'none';
        if (badgeAllPassed) {
            badgeAllPassed.style.display = 'inline-flex';
            if (badgeAllPassedTxt) {
                badgeAllPassedTxt.innerText = activeProv 
                    ? `ผลการตรวจ จ.${activeProv} ผ่านมาตรฐานครบทุกรายการ ไม่พบปัญหาที่ต้องติดตาม`
                    : 'ผลการตรวจผ่านมาตรฐานครบทุกรายการ ไม่พบปัญหาที่ต้องติดตาม';
            }
        }
    }

    const cPend = document.getElementById('chip-pending-count');
    const cWarn = document.getElementById('chip-warned-count');
    const cSeiz = document.getElementById('chip-seized-count');
    const cFine = document.getElementById('chip-fined-count');
    const cRetest = document.getElementById('chip-retest-count');

    if (cPend) cPend.innerText = counts.pending;
    if (cWarn) cWarn.innerText = counts.warned;
    if (cSeiz) cSeiz.innerText = counts.seized;
    if (cFine) cFine.innerText = counts.fined;
    if (cRetest) cRetest.innerText = counts.retested_passed;
}
window.updateCorrectiveActionGovernance = updateCorrectiveActionGovernance;

// Follow-up Actions Modal & Form Handlers
window.openAllFailedSamplesFollowupModal = function(provinceFilter) {
    window.currentFailedModalKey = 'all';
    const filterEl = document.getElementById('dashProvinceFilter');
    const selectedProv = provinceFilter || (filterEl && filterEl.value !== 'all' ? filterEl.value : null) || window.getCurrentUserProvince() || 'all';
    const modalTitle = (selectedProv && selectedProv !== 'all')
        ? `ตัวอย่างไม่ผ่านเกณฑ์มาตรฐาน จ.${selectedProv} (Closed-Loop Follow-up)`
        : 'ตัวอย่างไม่ผ่านเกณฑ์มาตรฐานทั้งหมด (Closed-Loop Follow-up)';
    window.openFailedSamplesModal('all', modalTitle, selectedProv);
};

window.openCorrectiveDetailModal = function(idKey, forceReadOnly) {
    let target = null;
    let foundSubstance = '';
    for (const k in window.currentFailedSamples) {
        if (Array.isArray(window.currentFailedSamples[k])) {
            const match = window.currentFailedSamples[k].find(s => (s.identifier === idKey || s.code === idKey || (s.name + s.date + s.province) === idKey));
            if (match) {
                target = match;
                foundSubstance = (window.substanceDictionary && window.substanceDictionary[k]) ? window.substanceDictionary[k].label : k;
                break;
            }
        }
    }

    const detail = window.getSampleActionDetail(idKey);
    const targetProv = target ? (target.province || '') : '';
    const canEdit = !forceReadOnly && window.canUserEditSample(targetProv);

    const headerTitleEl = document.getElementById('cad-modal-header-title');
    if (headerTitleEl) {
        headerTitleEl.innerText = canEdit ? 'บันทึกการติดตามผลหลังพบปัญหา' : 'รายละเอียดการติดตามผลหลังพบปัญหา';
    }

    document.getElementById('cad-target-id').value = idKey;
    document.getElementById('cad-sample-title').innerText = `รหัสตัวอย่าง: ${target ? (target.code || target.identifier) : idKey}`;
    document.getElementById('cad-sample-name').innerText = target ? (target.name || '-') : '-';
    document.getElementById('cad-substance-fail').innerText = foundSubstance || 'ไม่ผ่านมาตรฐาน';
    document.getElementById('cad-sample-location').innerText = target ? (target.location || target.source || '-') : '-';
    document.getElementById('cad-sample-area').innerText = target ? `อ.${target.district || '-'} จ.${target.province || '-'}` : '-';

    const statusEl = document.getElementById('cad-action-status');
    const dateEl = document.getElementById('cad-action-date');
    const officerEl = document.getElementById('cad-action-officer');
    const notesEl = document.getElementById('cad-action-notes');
    const radioPending = document.getElementById('cad-radio-pending');
    const radioClosed = document.getElementById('cad-radio-closed');
    const readonlyBanner = document.getElementById('cad-readonly-banner');
    const btnSave = document.getElementById('cad-btn-save');

    if (statusEl) statusEl.value = detail.status || 'pending';
    if (dateEl) dateEl.value = detail.actionDate || new Date().toISOString().split('T')[0];
    
    const currentUserName = (window.app && window.app.currentUser) ? (window.app.currentUser.fullname || window.app.currentUser.workplace) : '';
    if (officerEl) officerEl.value = detail.officer || currentUserName || 'กลุ่มงาน คบส. สสจ.';
    if (notesEl) notesEl.value = detail.notes || '';

    if (detail.isClosed) {
        if (radioClosed) radioClosed.checked = true;
    } else {
        if (radioPending) radioPending.checked = true;
    }

    // Toggle Read-Only vs Editable mode
    if (!canEdit) {
        if (readonlyBanner) {
            readonlyBanner.style.display = 'block';
            let user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
            if (!user) {
                try {
                    const sess = sessionStorage.getItem('sskmoph_session');
                    if (sess) user = JSON.parse(sess);
                } catch(e){}
            }
            const isAdmin = user && (user.role === 'admin' || user.username === 'admin');
            if (isAdmin) {
                readonlyBanner.innerHTML = `<i class="fa-solid fa-eye"></i> <strong>โหมดดูรายละเอียด (Admin):</strong> สามารถดูรายละเอียดผลการดำเนินงานของ จ.${targetProv || '-'} ได้ (ไม่อนุญาตให้บันทึกหรือแก้ไขแทนเจ้าหน้าที่ประจำจังหวัด)`;
            } else {
                readonlyBanner.innerHTML = `<i class="fa-solid fa-lock"></i> <strong>โหมดดูข้อมูลอย่างเดียว:</strong> คุณไม่มีสิทธิ์แก้ไขข้อมูลของ จ.${targetProv || '-'} (สิทธิ์การบันทึกแก้ไขเฉพาะเจ้าหน้าที่ผู้รับผิดชอบ จ.${targetProv || '-'} เท่านั้น)`;
            }
        }
        if (btnSave) btnSave.style.display = 'none';
        if (statusEl) statusEl.disabled = true;
        if (dateEl) dateEl.disabled = true;
        if (officerEl) officerEl.disabled = true;
        if (notesEl) notesEl.disabled = true;
        if (radioPending) radioPending.disabled = true;
        if (radioClosed) radioClosed.disabled = true;
    } else {
        if (readonlyBanner) readonlyBanner.style.display = 'none';
        if (btnSave) btnSave.style.display = 'inline-flex';
        if (statusEl) statusEl.disabled = false;
        if (dateEl) dateEl.disabled = false;
        if (officerEl) officerEl.disabled = false;
        if (notesEl) notesEl.disabled = false;
        if (radioPending) radioPending.disabled = false;
        if (radioClosed) radioClosed.disabled = false;
    }

    document.getElementById('correctiveActionDetailModal').classList.add('active');
};

window.closeCorrectiveActionDetailModal = function() {
    document.getElementById('correctiveActionDetailModal').classList.remove('active');
};

window.onCorrectiveStatusChange = function(status) {
    if (status !== 'pending') {
        document.getElementById('cad-radio-closed').checked = true;
    } else {
        document.getElementById('cad-radio-pending').checked = true;
    }
};

window.submitCorrectiveActionForm = function(e) {
    e.preventDefault();
    const idKey = document.getElementById('cad-target-id').value;
    if (!idKey) return;

    const status = document.getElementById('cad-action-status').value;
    const actionDate = document.getElementById('cad-action-date').value;
    const officer = document.getElementById('cad-action-officer').value;
    const notes = document.getElementById('cad-action-notes').value;
    const isClosed = document.querySelector('input[name="cad_is_closed"]:checked')?.value === 'true';

    window.saveCorrectiveActionDetail(idKey, {
        status: status,
        actionDate: actionDate,
        officer: officer,
        notes: notes,
        isClosed: isClosed
    });

    window.closeCorrectiveActionDetailModal();

    // Re-render failed samples modal if open
    const currentSubstanceLabel = document.getElementById('failedSubstanceName')?.innerText || '';
    if (document.getElementById('failedSamplesModal').classList.contains('active')) {
        window.openFailedSamplesModal(window.currentFailedModalKey || 'all', currentSubstanceLabel || 'ตัวอย่างไม่ผ่านเกณฑ์มาตรฐาน');
    }

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'บันทึกผลการติดตามสำเร็จ',
            text: 'ข้อมูลการจัดการปัญหาถูกบันทึกและซิงค์กับแดชบอร์ดเรียบร้อยแล้ว',
            timer: 1600,
            showConfirmButton: false
        });
    }
};


// 4. LOCATION RISK & HIGH-RISK FOOD MATRIX (มิติที่ 4)
function updateLocationRiskAndFoodMatrix(samples) {
    if (!Array.isArray(samples)) return;

    // 10 Location Types from Form MU.10
    const locationCategories = [
        { name: 'ตลาดสด', icon: 'fa-basket-shopping' },
        { name: 'ตลาดนัด', icon: 'fa-tent' },
        { name: 'ห้างสรรพสินค้า/ซุปเปอร์มาร์เก็ต', icon: 'fa-cart-shopping' },
        { name: 'ห้องเย็น', icon: 'fa-snowflake' },
        { name: 'โรงเรียน/สถานศึกษา', icon: 'fa-school' },
        { name: 'โรงพยาบาล/สถานพยาบาล', icon: 'fa-hospital' },
        { name: 'ร้านอาหาร', icon: 'fa-utensils' },
        { name: 'แผงลอยจำหน่ายอาหาร', icon: 'fa-store' },
        { name: 'โรงงาน/สถานที่ผลิตอาหาร', icon: 'fa-industry' },
        { name: 'อื่นๆ', icon: 'fa-location-dot' }
    ];

    const locStats = {};
    locationCategories.forEach(lc => {
        locStats[lc.name] = { ...lc, total: 0, fail: 0 };
    });

    function resolveLocType(s) {
        if (s.location_type && locStats[s.location_type]) return s.location_type;
        const text = (s.collection_place || s.collection_location || s.location_name || s.agency || '').toLowerCase();
        if (text.includes('ตลาดสด')) return 'ตลาดสด';
        if (text.includes('ตลาดนัด') || text.includes('ถนนคนเดิน')) return 'ตลาดนัด';
        if (text.includes('ห้าง') || text.includes('ซุปเปอร์') || text.includes('บิ๊กซี') || text.includes('โลตัส') || text.includes('แม็คโคร')) return 'ห้างสรรพสินค้า/ซุปเปอร์มาร์เก็ต';
        if (text.includes('ห้องเย็น')) return 'ห้องเย็น';
        if (text.includes('โรงเรียน') || text.includes('ศูนย์เด็ก')) return 'โรงเรียน/สถานศึกษา';
        if (text.includes('โรงพยาบาล') || text.includes('รพ.') || text.includes('รพ.สต.')) return 'โรงพยาบาล/สถานพยาบาล';
        if (text.includes('ร้านอาหาร') || text.includes('ครัว')) return 'ร้านอาหาร';
        if (text.includes('แผงลอย') || text.includes('รถเร่')) return 'แผงลอยจำหน่ายอาหาร';
        if (text.includes('โรงงาน') || text.includes('ผลิต')) return 'โรงงาน/สถานที่ผลิตอาหาร';
        return 'ตลาดสด';
    }

    samples.forEach(s => {
        const lType = resolveLocType(s);
        if (locStats[lType]) {
            locStats[lType].total++;
            let isFail = false;
            let idx = 1;
            while (s['sample_name_' + idx] !== undefined && idx <= 50) {
                const sum = window.getItemSubstanceSummary ? window.getItemSubstanceSummary(s, idx, 'all') : '';
                if (sum && sum.includes('ไม่ผ่าน')) {
                    isFail = true;
                    break;
                }
                idx++;
            }
            if (!isFail && s.sample_name) {
                const sum = window.getItemSubstanceSummary ? window.getItemSubstanceSummary(s, null, 'all') : '';
                if (sum && sum.includes('ไม่ผ่าน')) isFail = true;
            }
            if (isFail) locStats[lType].fail++;
        }
    });

    // Render Location Risk List
    const locContainer = document.getElementById('locationRiskListContainer');
    if (locContainer) {
        const sortedLocs = Object.values(locStats).sort((a, b) => b.fail - a.fail || b.total - a.total);
        const maxTotal = Math.max(...sortedLocs.map(l => l.total), 1);

        locContainer.innerHTML = sortedLocs.map(l => {
            const failPct = l.total > 0 ? ((l.fail / l.total) * 100).toFixed(1) : '0.0';
            const widthPct = Math.min((l.total / maxTotal) * 100, 100);
            const hasFail = l.fail > 0;
            return `
                <div class="loc-risk-item">
                    <div class="loc-risk-left">
                        <div class="loc-icon-badge"><i class="fa-solid ${l.icon}"></i></div>
                        <span class="loc-name">${l.name}</span>
                    </div>
                    <div class="loc-risk-bar-box">
                        <div class="loc-track">
                            <div class="loc-fill ${hasFail ? 'has-fail' : ''}" style="width: ${widthPct}%;"></div>
                        </div>
                        <div class="loc-meta-sub">
                            <span>ตรวจ ${l.total} ตัวอย่าง</span>
                            <span>${hasFail ? `พบไม่ผ่าน ${l.fail} (${failPct}%)` : 'ปลอดภัย 100%'}</span>
                        </div>
                    </div>
                    <span class="loc-badge-stat ${hasFail ? 'badge-fail' : 'badge-safe'}">
                        ${hasFail ? `${failPct}% เสี่ยง` : 'ปลอดภัย'}
                    </span>
                </div>
            `;
        }).join('');
    }

    // 2. High-Risk Food Matrix (Top 5 Non-compliant Foods)
    const foodMap = {};
    for (const subKey in window.currentFailedSamples) {
        if (subKey === 'all') continue;
        const subLabel = window.substanceDictionary[subKey]?.label || subKey;
        const failedItems = window.currentFailedSamples[subKey] || [];
        failedItems.forEach(item => {
            const foodName = (item.name || 'ไม่ระบุชื่ออาหาร').trim();
            if (!foodMap[foodName]) {
                foodMap[foodName] = { name: foodName, count: 0, substances: new Set() };
            }
            foodMap[foodName].count++;
            foodMap[foodName].substances.add(subLabel);
        });
    }

    const foodContainer = document.getElementById('highRiskFoodMatrixContainer');
    if (foodContainer) {
        const sortedFoods = Object.values(foodMap).sort((a, b) => b.count - a.count).slice(0, 5);
        if (sortedFoods.length === 0) {
            foodContainer.innerHTML = `
                <div style="text-align: center; padding: 35px 20px; color: #10b981; font-weight: 600;">
                    <i class="fa-solid fa-shield-check" style="font-size: 36px; margin-bottom: 10px; display: block;"></i>
                    ไม่พบรายการอาหารที่มีสารปนเปื้อนเกินมาตรฐาน (ปลอดภัย 100%)
                </div>
            `;
        } else {
            const rankColors = [
                'linear-gradient(135deg, #ef4444, #dc2626)',
                'linear-gradient(135deg, #f97316, #ea580c)',
                'linear-gradient(135deg, #f59e0b, #d97706)',
                'linear-gradient(135deg, #64748b, #475569)',
                'linear-gradient(135deg, #94a3b8, #64748b)'
            ];
            foodContainer.innerHTML = sortedFoods.map((f, idx) => {
                const subTags = Array.from(f.substances).map(s => `<span class="substance-mini-tag">${s}</span>`).join('');
                return `
                    <div class="food-matrix-item">
                        <div class="food-rank-badge" style="background: ${rankColors[idx] || rankColors[4]};">
                            ${idx + 1}
                        </div>
                        <div class="food-matrix-info">
                            <div class="food-matrix-name">${f.name}</div>
                            <div class="food-matrix-substances">${subTags}</div>
                        </div>
                        <div class="food-matrix-count">
                            ${f.count} <small>ตัวอย่างที่พบ</small>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}
window.updateLocationRiskAndFoodMatrix = updateLocationRiskAndFoodMatrix;

// ==========================================================================
// Dedicated Follow-up Tracking View Logic (Closed-Loop Governance)
// ==========================================================================

window.followupCurrentProvince = 'all';

window.getCompiledFailedSamples = function() {
    let allList = [];
    const substanceLabels = {
        'pesticide': 'ยาฆ่าแมลง',
        'borax': 'สารบอแรกซ์',
        'formalin': 'สารฟอร์มาลิน',
        'bleach': 'สารฟอกขาว',
        'salicylic': 'สารกันรา',
        'agonist': 'สารเร่งเนื้อแดง',
        'polar': 'สารโพลาร์ในน้ำมันทอด',
        'coliformFood': 'โคลิฟอร์มในอาหาร',
        'coliformWater': 'โคลิฟอร์มในน้ำ'
    };

    for (const subKey in window.currentFailedSamples) {
        if (subKey !== 'all' && Array.isArray(window.currentFailedSamples[subKey])) {
            window.currentFailedSamples[subKey].forEach(s => {
                const identifier = s.identifier || s.code || (s.name + s.date + s.province);
                let existing = allList.find(x => x.identifier === identifier);
                const label = substanceLabels[subKey] || subKey;
                if (!existing) {
                    existing = {
                        ...s,
                        identifier: identifier,
                        substances: [label],
                        substanceKeys: [subKey]
                    };
                    allList.push(existing);
                } else {
                    if (!existing.substances.includes(label)) {
                        existing.substances.push(label);
                        existing.substanceKeys.push(subKey);
                    }
                }
            });
        }
    }
    return allList;
};

window.setFollowupProvince = function(prov) {
    window.followupCurrentProvince = prov || 'all';
    document.querySelectorAll('#followupProvinceTabs .prov-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-prov') === window.followupCurrentProvince) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    window.renderFollowupPageView(window.followupCurrentProvince);
};

window.handleFollowupFilterChange = function() {
    window.renderFollowupTable();
};

window.navigateToFollowupPage = function(targetProv) {
    const filterEl = document.getElementById('dashProvinceFilter');
    const prov = targetProv || (filterEl && filterEl.value !== 'all' ? filterEl.value : null) || window.getCurrentUserProvince() || 'all';
    if (window.app && typeof window.app.switchView === 'function') {
        window.app.switchView('followup');
    }
    window.setFollowupProvince(prov);
};

window.openAllFailedSamplesFollowupModal = function(provinceFilter) {
    window.navigateToFollowupPage(provinceFilter);
};

window.getPendingFollowupCount = function() {
    const actions = window.getStoredCorrectiveActions();
    let count = 0;
    const all = window.getCompiledFailedSamples();
    const uProv = window.getCurrentUserProvince();
    all.forEach(s => {
        if (uProv === 'all' || s.province === uProv) {
            const item = actions[s.identifier];
            let st = 'pending';
            if (typeof item === 'string') st = item;
            else if (item && typeof item === 'object') st = item.status || 'pending';
            if (st === 'pending') count++;
        }
    });
    return count;
};

window.renderFollowupPageView = function(provinceFilter) {
    // Ensure failed samples are populated from dataset
    const hasData = Object.keys(window.currentFailedSamples || {}).some(k => Array.isArray(window.currentFailedSamples[k]) && window.currentFailedSamples[k].length > 0);
    if (!hasData && window.app && Array.isArray(window.app.samples) && window.app.samples.length > 0) {
        if (typeof window.updateSubstanceCharts === 'function') {
            window.updateSubstanceCharts(window.app.samples);
        }
    }

    if (provinceFilter !== undefined && provinceFilter !== null) {
        window.followupCurrentProvince = provinceFilter;
    } else if (!window.followupCurrentProvince || window.followupCurrentProvince === 'all') {
        const uProv = window.getCurrentUserProvince();
        if (uProv && uProv !== 'all') {
            window.followupCurrentProvince = uProv;
        }
    }
    const activeProv = window.followupCurrentProvince || 'all';

    // Update active tab UI
    document.querySelectorAll('#followupProvinceTabs .prov-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-prov') === activeProv) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Permission Note Banner
    const user = (window.app && window.app.currentUser) ? window.app.currentUser : null;
    const permBannerTxt = document.getElementById('followup-perm-txt');
    if (permBannerTxt) {
        if (user && (user.role === 'admin' || user.username === 'admin')) {
            permBannerTxt.innerHTML = `<strong>สิทธิ์ผู้ดูแลระบบ (Admin)</strong>: ติดตามผลการดำเนินงานได้ทั้ง 5 จังหวัด (โหมดดูรายละเอียด / ไม่อนุญาตให้บันทึกแทน)`;
        } else if (user && user.role === 'lab') {
            permBannerTxt.innerHTML = `<strong>สิทธิ์ศูนย์วิทยาศาสตร์การแพทย์ที่ 10</strong>: ติดตามผลการดำเนินงานด้านอาหารปลอดภัย เขตสุขภาพที่ 10`;
        } else {
            const uProv = window.getCurrentUserProvince();
            if (uProv && uProv !== 'all') {
                permBannerTxt.innerHTML = `<strong>สิทธิ์ประจำ จ.${uProv}</strong>: สามารถบันทึกและแก้ไขข้อมูลได้เฉพาะ จ.${uProv} (จังหวัดอื่นอ่านอย่างเดียว)`;
            } else {
                permBannerTxt.innerHTML = `ตรวจสิทธิ์ตามพื้นที่ผู้ใช้งาน`;
            }
        }
    }

    const allSamples = window.getCompiledFailedSamples();
    const actions = window.getStoredCorrectiveActions();

    // Update tab count badges
    const provCounts = { all: allSamples.length, 'อุบลราชธานี': 0, 'ศรีสะเกษ': 0, 'ยโสธร': 0, 'อำนาจเจริญ': 0, 'มุกดาหาร': 0 };
    allSamples.forEach(s => {
        if (provCounts[s.province] !== undefined) {
            provCounts[s.province]++;
        }
    });
    const tbAll = document.getElementById('fp-tab-count-all');
    const tbUb = document.getElementById('fp-tab-count-ubon');
    const tbSs = document.getElementById('fp-tab-count-sisaket');
    const tbYs = document.getElementById('fp-tab-count-yasothon');
    const tbAm = document.getElementById('fp-tab-count-amnat');
    const tbMk = document.getElementById('fp-tab-count-mukdahan');
    if (tbAll) tbAll.innerText = provCounts.all;
    if (tbUb) tbUb.innerText = provCounts['อุบลราชธานี'];
    if (tbSs) tbSs.innerText = provCounts['ศรีสะเกษ'];
    if (tbYs) tbYs.innerText = provCounts['ยโสธร'];
    if (tbAm) tbAm.innerText = provCounts['อำนาจเจริญ'];
    if (tbMk) tbMk.innerText = provCounts['มุกดาหาร'];

    // Filter samples for current active scope
    const scopedSamples = activeProv === 'all' ? allSamples : allSamples.filter(s => s.province === activeProv);
    const totalFailed = scopedSamples.length;

    let counts = { pending: 0, warned: 0, seized: 0, fined: 0, retested_passed: 0 };
    scopedSamples.forEach(s => {
        const item = actions[s.identifier];
        let st = 'pending';
        if (typeof item === 'string') st = item;
        else if (item && typeof item === 'object') st = item.status || 'pending';
        if (counts[st] !== undefined) counts[st]++;
        else counts.pending++;
    });

    const kpiTotal = document.getElementById('fp-kpi-total');
    const kpiClosed = document.getElementById('fp-kpi-closed-pct');
    const kpiPend = document.getElementById('fp-kpi-pending-pct');
    const progLbl = document.getElementById('fp-progress-lbl');
    const barEl = document.getElementById('fp-closed-bar');

    if (totalFailed > 0) {
        const closedCount = counts.warned + counts.seized + counts.fined + counts.retested_passed;
        const closedPct = ((closedCount / totalFailed) * 100).toFixed(1);
        const pendingPct = ((counts.pending / totalFailed) * 100).toFixed(1);

        if (kpiTotal) kpiTotal.innerText = totalFailed;
        if (kpiClosed) kpiClosed.innerText = `${closedPct}%`;
        if (kpiPend) kpiPend.innerText = `${pendingPct}%`;
        if (progLbl) progLbl.innerText = `${closedPct}% เสร็จสิ้น (${closedCount}/${totalFailed} รายการ)`;
        if (barEl) barEl.style.width = `${Math.min(parseFloat(closedPct), 100)}%`;
    } else {
        if (kpiTotal) kpiTotal.innerText = '0';
        if (kpiClosed) kpiClosed.innerText = '-';
        if (kpiPend) kpiPend.innerText = '-';
        if (progLbl) progLbl.innerText = 'ผลการตรวจผ่านมาตรฐานครบ 100% (ไม่พบปัญหาที่ต้องติดตามแก้ไข)';
        if (barEl) barEl.style.width = '0%';
    }

    const cPend = document.getElementById('fp-chip-pending');
    const cWarn = document.getElementById('fp-chip-warned');
    const cSeiz = document.getElementById('fp-chip-seized');
    const cFine = document.getElementById('fp-chip-fined');
    const cRetest = document.getElementById('fp-chip-retest');
    if (cPend) cPend.innerText = counts.pending;
    if (cWarn) cWarn.innerText = counts.warned;
    if (cSeiz) cSeiz.innerText = counts.seized;
    if (cFine) cFine.innerText = counts.fined;
    if (cRetest) cRetest.innerText = counts.retested_passed;

    window.renderFollowupTable(scopedSamples);
};

window.renderFollowupTable = function(sourceSamples) {
    const tbody = document.getElementById('followupTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const activeProv = window.followupCurrentProvince || 'all';
    let list = sourceSamples || window.getCompiledFailedSamples();
    if (activeProv !== 'all') {
        list = list.filter(s => s.province === activeProv);
    }

    // Status filter
    const statusSelect = document.getElementById('fpStatusFilter');
    const statusFilter = statusSelect ? statusSelect.value : 'all';

    // Search filter
    const searchInput = document.getElementById('fpSearchInput');
    const q = (searchInput ? searchInput.value : '').trim().toLowerCase();

    const actions = window.getStoredCorrectiveActions();

    const actionLabels = {
        'pending': '🟡 อยู่ระหว่างติดตาม',
        'warned': '🔵 ตักเตือน/แนะนำ',
        'seized': '🟠 อายัด/ทำลายสินค้า',
        'fined': '🔴 ดำเนินคดี/ปรับ',
        'retested_passed': '🟢 สุ่มตรวจซ้ำผ่าน'
    };

    let filtered = list.filter(s => {
        const item = actions[s.identifier];
        let st = 'pending';
        if (typeof item === 'string') st = item;
        else if (item && typeof item === 'object') st = item.status || 'pending';

        if (statusFilter !== 'all' && st !== statusFilter) return false;

        if (q) {
            const combined = `${s.name || ''} ${s.code || ''} ${s.location || ''} ${s.district || ''} ${s.province || ''} ${(s.substances || []).join(' ')}`.toLowerCase();
            if (!combined.includes(q)) return false;
        }
        return true;
    });

    const countEl = document.getElementById('fp-table-count');
    if (countEl) countEl.innerText = filtered.length;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 36px 20px; color: #64748b;">
                    <i class="fa-solid fa-clipboard-check" style="font-size: 38px; color: #10b981; margin-bottom: 12px; display: block;"></i>
                    <strong style="font-size: 15px; color: #1e293b;">ไม่พบรายการที่ต้องติดตามผล</strong>
                    <div style="font-size: 13px; color: #64748b; margin-top: 4px;">ตัวอย่างผ่านมาตรฐานครบถ้วน หรือไม่พบข้อมูลตามเงื่อนไขการค้นหาที่เลือก</div>
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach((s, idx) => {
        const idKey = s.identifier;
        const curDetail = window.getSampleActionDetail(idKey);
        const curAction = curDetail.status || 'pending';
        const hasDetail = Boolean(curDetail.actionDate || curDetail.officer || curDetail.notes);
        const canEdit = window.canUserEditSample(s.province);

        const subBadges = (s.substances || []).map(sub => `<span class="badge-substance-fail"><i class="fa-solid fa-triangle-exclamation"></i> ${sub}</span>`).join('');

        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #f1f5f9';
        tr.innerHTML = `
            <td style="text-align: center; padding: 12px 8px; font-weight: 600; color: #64748b;">${idx + 1}</td>
            <td style="padding: 12px 14px;">
                <div style="font-weight: 700; color: #0284c7; font-family: monospace; font-size: 13px;">${s.code || '-'}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 3px;"><i class="fa-regular fa-calendar"></i> ${s.date || '-'}</div>
            </td>
            <td style="padding: 12px 14px;">
                <div style="font-weight: 700; color: #0f172a; font-size: 14px;">${s.name || '-'}</div>
                <div style="font-size: 12.5px; color: #64748b; margin-top: 3px;">
                    <i class="fa-solid fa-location-dot" style="color: #94a3b8; font-size: 11px;"></i> ${s.location || s.source || '-'}
                </div>
            </td>
            <td style="padding: 12px 14px;">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${subBadges || '<span class="badge-substance-fail">ไม่ผ่านเกณฑ์</span>'}
                </div>
            </td>
            <td style="padding: 12px 14px;">
                <div style="color: #0f172a; font-weight: 600;">อ.${s.district || '-'}</div>
                <div style="font-size: 12.5px; color: #64748b; margin-top: 2px;">จ.${s.province || '-'}</div>
            </td>
            <td style="padding: 12px 14px;">
                <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; background-color: #e0f2fe; color: #0369a1; font-size: 11.5px; font-weight: 700; border: 1px solid #bae6fd; white-space: nowrap;">
                    ${s.form_type || '-'}
                </span>
            </td>
            <td style="padding: 12px 14px; min-width: 295px;">
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${canEdit ? `
                        <div class="fp-action-cell-row">
                            <select class="action-status-select status-${curAction}" onchange="window.updateSampleAction('${idKey}', this.value); this.className='action-status-select status-'+this.value;">
                                <option value="pending" ${curAction === 'pending' ? 'selected' : ''}>🟡 อยู่ระหว่างติดตาม</option>
                                <option value="warned" ${curAction === 'warned' ? 'selected' : ''}>🔵 ตักเตือน/แนะนำ</option>
                                <option value="seized" ${curAction === 'seized' ? 'selected' : ''}>🟠 อายัด/ทำลายสินค้า</option>
                                <option value="fined" ${curAction === 'fined' ? 'selected' : ''}>🔴 ดำเนินคดี/ปรับ</option>
                                <option value="retested_passed" ${curAction === 'retested_passed' ? 'selected' : ''}>🟢 สุ่มตรวจซ้ำผ่าน</option>
                            </select>
                            <button type="button" class="btn-open-fp-detail" title="บันทึกรายละเอียดการติดตามผล" onclick="window.openCorrectiveDetailModal('${idKey}', false)">
                                <i class="fa-solid fa-pen-to-square"></i> บันทึกผล
                            </button>
                        </div>
                    ` : `
                        <div class="fp-action-cell-row">
                            <div class="action-status-badge status-${curAction} readonly" title="เฉพาะผู้รับผิดชอบ จ.${s.province || '-'}">
                                <span>${actionLabels[curAction] || curAction}</span>
                                <i class="fa-solid fa-lock" style="font-size: 10px; opacity: 0.65; margin-left: 6px;" title="สิทธิ์การแก้ไขเฉพาะเจ้าหน้าที่ จ.${s.province || '-'}"></i>
                            </div>
                            <button type="button" class="btn-open-fp-detail readonly-btn" title="ดูรายละเอียดผลการดำเนินงาน" onclick="window.openCorrectiveDetailModal('${idKey}', true)">
                                <i class="fa-solid fa-eye"></i> ดูรายละเอียด
                            </button>
                        </div>
                    `}
                    ${hasDetail ? `
                        <div class="fp-note-preview">
                            <strong><i class="fa-solid fa-clipboard-check"></i> ${curDetail.actionDate ? new Date(curDetail.actionDate).toLocaleDateString('th-TH') : 'บันทึกแล้ว'}:</strong> 
                            ${curDetail.notes ? (curDetail.notes.length > 32 ? curDetail.notes.substring(0, 32) + '...' : curDetail.notes) : (curDetail.officer || 'มีการบันทึกข้อมูล')}
                        </div>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
};
