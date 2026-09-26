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

    // 1. Province Chart (Bar Chart)
    provinceChartInstance = new Chart(provinceCtx, {
        type: 'bar',
        data: {
            labels: ['ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ', 'มุกดาหาร', 'ยโสธร'],
            datasets: [{
                label: 'จำนวนตัวอย่างที่ส่งตรวจ (รายจังหวัด)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(13, 148, 136, 0.75)',  /* Teal */
                    'rgba(59, 130, 246, 0.75)',  /* Blue */
                    'rgba(245, 158, 11, 0.75)',  /* Amber */
                    'rgba(139, 92, 246, 0.75)',  /* Purple */
                    'rgba(236, 72, 153, 0.75)'   /* Pink */
                ],
                borderColor: [
                    '#0d9488', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'
                ],
                borderWidth: 1.5,
                borderRadius: 6,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
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
                        font: { family: 'Sarabun' }
                    },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    ticks: {
                        font: { family: 'Sarabun', weight: 'bold' }
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
                    '#10b981',  /* Emerald green - Pass */
                    '#ef4444',  /* Red - Fail */
                    '#f59e0b'   /* Amber - Pending */
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Sarabun', size: 12 },
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });

    // 3. Form Type Chart (Horizontal Bar Chart)
    formTypeChartInstance = new Chart(formTypeCtx, {
        type: 'bar',
        data: {
            labels: [
                'ผัก/ผลไม้',
                'สารปนเปื้อน',
                'น้ำมัน Ebro',
                'น้ำมัน Kit',
                'เกลือบริโภค',
                'น้ำบริโภค',
                'โคลิฟอร์ม SI-2'
            ],
            datasets: [
                {
                    label: 'ผ่านเกณฑ์',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'ไม่ผ่านเกณฑ์',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    borderRadius: 4
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
                    labels: { font: { family: 'Sarabun' }, usePointStyle: true }
                },
                tooltip: {
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
                    ticks: { font: { family: 'Sarabun', size: 10 }, maxRotation: 45, minRotation: 45 },
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { family: 'Sarabun' } },
                    grid: { color: '#f1f5f9' }
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
    const passed = samples.filter(s => s.status === 'approved' && s.analysis_summary === 'ผ่านเกณฑ์มาตรฐาน').length;
    const failed = samples.filter(s => s.status === 'approved' && s.analysis_summary === 'ไม่ผ่านเกณฑ์มาตรฐาน').length;
    // Note: pending means not approved or summarized yet
    const pending = samples.filter(s => s.status !== 'approved' && s.status !== 'rejected').length;

    resultRatioChartInstance.data.datasets[0].data = [passed, failed, pending];
    resultRatioChartInstance.update();

    // 3. Calculate Form type distribution
    const forms = [
        'MU.10-001', 'MU.10-002', 'MU.10-003', 'MU.10-004',
        'MU.10-005', 'MU.10-006', 'MU.10-007'
    ];
    
    const passedCounts = forms.map(f => 
        samples.filter(s => s.form_type === f && s.status === 'approved' && s.analysis_summary === 'ผ่านเกณฑ์มาตรฐาน').length
    );
    const failedCounts = forms.map(f => 
        samples.filter(s => s.form_type === f && s.status === 'approved' && s.analysis_summary === 'ไม่ผ่านเกณฑ์มาตรฐาน').length
    );

    formTypeChartInstance.data.datasets[0].data = passedCounts;
    formTypeChartInstance.data.datasets[1].data = failedCounts;
    
    formTypeChartInstance.update();
    
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
        'coliformWater': { label: 'โคลิฟอร์มในน้ำ', total: 0, pass: 0, fail: 0 }
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
        const getVal = (key) => idx ? s[key + '_' + idx] : s[key];
        const getSummary = (key) => {
            const val = idx ? s['analysis_summary_' + idx + '_' + key] : s['analysis_summary_' + key];
            if (val === 'ผ่าน' || val === 'ไม่ผ่าน') return val;
            const det = idx ? s['analysis_detail_results_' + idx + '_' + key] : s['analysis_detail_results_' + key];
            if (det === 'ไม่พบ') return 'ผ่าน';
            if (det === 'พบ') return 'ไม่ผ่าน';
            return null;
        };
        const getSingleSummary = () => {
             const sum = idx ? s['analysis_summary_outcome_' + idx] || s['analysis_summary_' + idx] : s['analysis_summary_outcome'] || s['analysis_summary'];
             if(sum && sum.includes('ไม่ผ่าน')) return 'ไม่ผ่าน';
             if(sum && sum.includes('ผ่าน')) return 'ผ่าน';
             return sum;
        };

        const inc = (type, summaryVal) => {
            stats[type].total++;
            if (summaryVal === 'ผ่าน' || summaryVal === 'ผ่านเกณฑ์มาตรฐาน') {
                stats[type].pass++;
            } else if (summaryVal === 'ไม่ผ่าน' || summaryVal === 'ไม่ผ่านเกณฑ์มาตรฐาน') {
                stats[type].fail++;
                // Save this sample info
                let subName = idx ? s['sample_name_'+idx] : s.sample_name;
                window.currentFailedSamples[type].push({
                    name: subName || s.sample_id || '-',
                    date: s.collection_date || '-',
                    province: s.province || '-',
                    location: s.collection_place || s.collection_location || s.location_name || '-',
                    form_type: s.form_type || '-'
                });
            }
        };

        if (s.form_type === 'MU.10-001') {
            inc('pesticide', getSingleSummary());
        } else if (s.form_type === 'MU.10-002') {
            if (getVal('test_borax')) inc('borax', getSummary('borax'));
            if (getVal('test_formalin')) inc('formalin', getSummary('formalin'));
            if (getVal('test_bleach')) inc('bleach', getSummary('bleach'));
            if (getVal('test_salicylic')) inc('salicylic', getSummary('salicylic'));
            if (getVal('test_agonist')) inc('agonist', getSummary('agonist'));
        } else if (s.form_type === 'MU.10-003' || s.form_type === 'MU.10-004') {
            const num = parseFloat(getVal('polar_value') || getVal('analysis_interpretation'));
            if(!isNaN(num)) {
                 stats['polar'].total++;
                 if(num <= 25) {
                     stats['polar'].pass++;
                 } else {
                     stats['polar'].fail++;
                     let subName = idx ? s['sample_name_'+idx] : s.sample_name;
                     window.currentFailedSamples['polar'].push({
                         name: subName || s.sample_id || '-',
                         date: s.collection_date || '-',
                         province: s.province || '-',
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
            inc('coliformWater', getSingleSummary());
        }
    }

    const grid = document.getElementById('substance-charts-grid');
    if (!grid) return;
    
    // Check if we need to build the DOM
    if (grid.children.length === 0) {
        for (const key in stats) {
            const item = stats[key];
            const col = document.createElement('div');
            col.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;';
            col.innerHTML = `
                  <h6 style="margin: 0 0 10px 0; font-weight: bold; color: #334155; text-align: center; font-size: 14px;">${item.label}</h6>
                  <div id="substance-text-${key}" style="width: 100%; margin-bottom: 10px;"></div>
                  <div style="position: relative; width: 100%; height: 180px; margin: 0 auto;">
                      <canvas id="substance-chart-${key}"></canvas>
                  </div>
                  <div id="substance-action-${key}" style="width: 100%; margin-top: 10px;"></div>
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
            ? `<button type="button" onclick="openFailedSamplesModal('${key}', '${item.label}')" style="width: 100%; padding: 6px; background-color: #fee2e2; border: 1px solid #fca5a5; color: #ef4444; border-radius: 6px; font-size: 11px; cursor: pointer; transition: all 0.2s;"><i class="fa-solid fa-search"></i> ดูตัวอย่างที่ไม่ผ่าน</button>`
            : `<div style="height: 27px;"></div>`;
            
        const passPct = item.total > 0 ? ((item.pass / item.total) * 100).toFixed(1) : 0;
        const failPct = item.total > 0 ? ((item.fail / item.total) * 100).toFixed(1) : 0;
        
        const miniCardStyle = "display: flex; align-items: center; background: #fff; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 8px 6px; width: 31%; box-sizing: border-box; transition: transform 0.2s;";
        const iconStyle = "display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 4px; color: #fff; font-size: 10px; margin-right: 4px; flex-shrink: 0;";

        document.getElementById('substance-text-' + key).innerHTML = `
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #3b82f6;"><i class="fa-solid fa-database"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 9px; color: #64748b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ตรวจ</div>
                        <div style="font-size: 11px; font-weight: bold; color: #0f172a;">${item.total}</div>
                    </div>
                </div>
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #10b981;"><i class="fa-solid fa-check"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 9px; color: #64748b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ผ่าน</div>
                        <div style="font-size: 11px; font-weight: bold; color: #10b981;">${item.pass} <span style="font-size: 8px; color: #64748b; font-weight: normal;">(${passPct}%)</span></div>
                    </div>
                </div>
                <div style="${miniCardStyle}">
                    <div style="${iconStyle} background-color: #ef4444;"><i class="fa-solid fa-xmark"></i></div>
                    <div style="text-align: left; line-height: 1.1; overflow: hidden;">
                        <div style="font-size: 9px; color: #64748b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">ไม่ผ่าน</div>
                        <div style="font-size: 11px; font-weight: bold; color: #ef4444;">${item.fail} <span style="font-size: 8px; color: #64748b; font-weight: normal;">(${failPct}%)</span></div>
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
            bgColors = ['#e2e8f0']; // Grey ring
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

        uniqueSamples.forEach(s => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.name}</td>
                <td>${s.date}</td>
                <td>${s.province}</td>
                <td>${s.location}</td>
                <td>${s.form_type}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    document.getElementById('failedSamplesModal').classList.add('active');
};

window.closeFailedSamplesModal = function() {
    document.getElementById('failedSamplesModal').classList.remove('active');
};
