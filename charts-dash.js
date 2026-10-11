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

    // Set Global Chart Defaults for Veliora Dark Forest Theme
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#9cb0a4';
        Chart.defaults.font.family = "'Sarabun', 'Outfit', sans-serif";
    }

    // 1. Province Chart (Bar Chart) - Veliora Lime & Accents
    provinceChartInstance = new Chart(provinceCtx, {
        type: 'bar',
        data: {
            labels: ['ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ', 'มุกดาหาร', 'ยโสธร'],
            datasets: [{
                label: 'จำนวนตัวอย่างที่ส่งตรวจ (รายจังหวัด)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#c7f23c',  /* Veliora Lime */
                    '#38bdf8',  /* Sky Blue */
                    '#f59e0b',  /* Amber */
                    '#a78bfa',  /* Purple */
                    '#2dd4bf'   /* Mint */
                ],
                borderColor: [
                    '#c7f23c', '#38bdf8', '#f59e0b', '#a78bfa', '#2dd4bf'
                ],
                borderWidth: 1.5,
                borderRadius: 8,
                barPercentage: 0.55
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#07130d',
                    titleColor: '#c7f23c',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(199, 242, 60, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 10,
                    padding: 12,
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
                        color: '#9cb0a4',
                        font: { family: 'Sarabun' }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.07)' }
                },
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: { family: 'Sarabun', weight: 'bold' }
                    },
                    grid: { display: false }
                }
            }
        }
    });

    // 2. Result Ratio Chart (Doughnut Chart) - Veliora Lime / Coral / Amber
    resultRatioChartInstance = new Chart(resultRatioCtx, {
        type: 'doughnut',
        data: {
            labels: ['ผ่านเกณฑ์มาตรฐาน', 'ไม่ผ่านเกณฑ์มาตรฐาน', 'รอการตรวจวิเคราะห์'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#c7f23c',  /* Veliora Lime - Pass */
                    '#f43f5e',  /* Coral - Fail */
                    '#f59e0b'   /* Amber - Pending */
                ],
                borderWidth: 3,
                borderColor: '#10271d'
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
                        font: { family: 'Sarabun', size: 12 },
                        padding: 15,
                        usePointStyle: true,
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    backgroundColor: '#07130d',
                    titleColor: '#c7f23c',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(199, 242, 60, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 10,
                    padding: 12
                }
            }
        }
    });

    // 3. Form Type Chart (Horizontal Bar Chart) - Veliora Lime / Coral
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
                    backgroundColor: 'rgba(199, 242, 60, 0.85)',
                    borderColor: '#c7f23c',
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
                    labels: { font: { family: 'Sarabun' }, color: '#ffffff', usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: '#07130d',
                    titleColor: '#c7f23c',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(199, 242, 60, 0.3)',
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
                    ticks: { font: { family: 'Sarabun', size: 11 }, color: '#9cb0a4', autoSkip: false, maxRotation: 45, minRotation: 0 },
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#9cb0a4', font: { family: 'Sarabun' } },
                    grid: { color: 'rgba(255, 255, 255, 0.07)' }
                }
            }
        }
    });
}

// Update charts with actual data from database
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
    
    const startDateEl = document.getElementById('dashStartDate');
    const endDateEl = document.getElementById('dashEndDate');
    if (startDateEl && startDateEl.value) {
        samples = samples.filter(s => s.collection_date && s.collection_date >= startDateEl.value);
    }
    if (endDateEl && endDateEl.value) {
        samples = samples.filter(s => s.collection_date && s.collection_date <= endDateEl.value);
    }

    // 1. Calculate Province distribution
    const provinces = ['ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ', 'มุกดาหาร', 'ยโสธร'];
    const provinceCounts = provinces.map(prov => 
        samples.filter(s => s.province === prov).length
    );

    provinceChartInstance.data.datasets[0].data = provinceCounts;
    provinceChartInstance.update();

    // 2. Calculate Outcome ratios
    // Outcomes: Pass, Fail, Under Analysis (Registered/Accepted/Analyzing)
    let passed = 0;
    let failed = 0;
    let pending = 0;

    samples.forEach(s => {
        if (s.status === 'rejected') return;
        if (s.status !== 'approved') {
            pending++;
            return;
        }

        // Status is approved
        const sum = (s.analysis_summary_outcome || s.analysis_summary || '').toString().trim();
        if (sum.includes('ไม่ผ่าน')) {
            failed++;
        } else if (sum.includes('ผ่าน')) {
            passed++;
        } else {
            // Check item-level summaries
            let hasFail = false;
            let hasPass = false;
            let idx = 1;
            while (s['sample_name_' + idx] !== undefined) {
                const itemSum = (
                    s['analysis_summary_outcome_' + idx] || 
                    s['analysis_summary_' + idx] || 
                    s['analysis_coliform_summary_' + idx] || 
                    s['label_summary_' + idx] || ''
                ).toString();
                if (itemSum.includes('ไม่ผ่าน')) hasFail = true;
                else if (itemSum.includes('ผ่าน')) hasPass = true;
                idx++;
            }
            if (hasFail) failed++;
            else if (hasPass) passed++;
            else passed++;
        }
    });

    const totalOutcomes = passed + failed + pending;
    if (totalOutcomes === 0) {
        resultRatioChartInstance.data.labels = ['ไม่มีข้อมูล'];
        resultRatioChartInstance.data.datasets[0].data = [1];
        resultRatioChartInstance.data.datasets[0].backgroundColor = ['#183829'];
    } else {
        resultRatioChartInstance.data.labels = ['ผ่านเกณฑ์มาตรฐาน', 'ไม่ผ่านเกณฑ์มาตรฐาน', 'รอการตรวจวิเคราะห์'];
        resultRatioChartInstance.data.datasets[0].data = [passed, failed, pending];
        resultRatioChartInstance.data.datasets[0].backgroundColor = ['#c7f23c', '#f43f5e', '#f59e0b'];
    }
    resultRatioChartInstance.update();

    // 3. Calculate Form type distribution
    
    
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
        while (s['sample_name_' + idx] !== undefined) {
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
                    if (sk) inc(k, sk);
                });
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
            const col = document.createElement('div');
            col.style.cssText = 'background: rgba(16, 38, 28, 0.85); border: 1px solid rgba(199, 242, 60, 0.16); box-shadow: 0 10px 25px rgba(0,0,0,0.3); border-radius: 20px; padding: 18px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; backdrop-filter: blur(14px);';
            col.innerHTML = `
                  <h6 style="margin: 0 0 12px 0; font-weight: 700; color: #ffffff; text-align: center; font-size: 15px;">${item.label}</h6>
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
        const item = stats[key];
        const ctx = document.getElementById('substance-chart-' + key);
        if(!ctx) continue;
        
        const dataValues = [item.pass, item.fail];
        
        let viewBtn = item.fail > 0 
            ? `<button type="button" onclick="openFailedSamplesModal('${key}', '${item.label}')" style="width: 100%; padding: 8px; background-color: rgba(244, 63, 94, 0.16); border: 1px solid rgba(244, 63, 94, 0.38); color: #fca5a5; border-radius: 9999px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;"><i class="fa-solid fa-search"></i> ดูตัวอย่างที่ไม่ผ่าน</button>`
            : `<div style="height: 33px;"></div>`;
            
        const passPct = item.total > 0 ? ((item.pass / item.total) * 100).toFixed(1) : 0;
        const failPct = item.total > 0 ? ((item.fail / item.total) * 100).toFixed(1) : 0;
        
        const miniCardStyle = "display: flex; align-items: center; background: rgba(9, 22, 16, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 8px 8px; width: 31%; box-sizing: border-box; transition: transform 0.2s;";
        const iconStyle = "display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 10px; color: #fff; font-size: 14px; margin-right: 6px; flex-shrink: 0;";

        document.getElementById('substance-text-' + key).innerHTML = `
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #0284c7;"><i class="fa-solid fa-database"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 12px; color: #9cb0a4; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ตรวจ</div>
                        <div style="font-size: 16px; font-weight: bold; color: #38bdf8;">${item.total}</div>
                    </div>
                </div>
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #15803d;"><i class="fa-solid fa-check"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 12px; color: #9cb0a4; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ผ่าน</div>
                        <div style="font-size: 16px; font-weight: bold; color: #c7f23c;">${item.pass} <span style="font-size: 11px; color: #9cb0a4; font-weight: normal;">(${passPct}%)</span></div>
                    </div>
                </div>
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #be123c;"><i class="fa-solid fa-xmark"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 12px; color: #9cb0a4; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ไม่ผ่าน</div>
                        <div style="font-size: 16px; font-weight: bold; color: #f43f5e;">${item.fail} <span style="font-size: 11px; color: #9cb0a4; font-weight: normal;">(${failPct}%)</span></div>
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
            bgColors = ['#183829']; // Veliora dark forest ring
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
                            labels: { font: { family: 'Sarabun', size: 11 }, usePointStyle: true, boxWidth: 6, padding: 8 }
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
                                labels: { font: { family: 'Sarabun', size: 11 }, usePointStyle: true, padding: 12 }
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
            const rowBg = idx % 2 === 0 ? 'rgba(14, 34, 25, 0.75)' : 'rgba(18, 42, 31, 0.75)';
            tr.style.backgroundColor = rowBg;
            tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.06)';
            tr.style.transition = 'background-color 0.2s';
            tr.onmouseover = () => tr.style.backgroundColor = 'rgba(199, 242, 60, 0.12)';
            tr.onmouseout = () => tr.style.backgroundColor = rowBg;

            tr.innerHTML = `
                <td style="padding: 12px 16px;">
                    <div style="font-weight: 600; color: #ffffff;">${s.name || '-'}</div>
                    <div style="font-size: 12px; color: #9cb0a4; margin-top: 2px;"><i class="fa-solid fa-barcode"></i> ${s.code || '-'}</div>
                </td>
                <td style="padding: 12px 16px; color: #e2e8f0;">${s.date ? new Date(s.date).toLocaleDateString('th-TH') : '-'}</td>
                <td style="padding: 12px 16px;">
                    <div style="color: #ffffff; font-weight: 500;">${s.source || '-'}</div>
                    <div style="font-size: 13px; color: #9cb0a4; margin-top: 2px;"><i class="fa-solid fa-location-dot"></i> ${s.location || '-'}</div>
                </td>
                <td style="padding: 12px 16px;">
                    <div style="color: #ffffff;">อ.${s.district || '-'}</div>
                    <div style="font-size: 13px; color: #9cb0a4; margin-top: 2px;">จ.${s.province || '-'}</div>
                </td>
                <td style="padding: 12px 16px;">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: rgba(199, 242, 60, 0.15); color: #c7f23c; font-size: 12px; font-weight: 700; border: 1px solid rgba(199, 242, 60, 0.3); white-space: nowrap;">
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
