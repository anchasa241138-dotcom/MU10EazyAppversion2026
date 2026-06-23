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
                'MU.10-001 (ผัก/ผลไม้)',
                'MU.10-002 (สารปนเปื้อน)',
                'MU.10-003 (น้ำมัน Ebro)',
                'MU.10-004 (น้ำมัน Kit)',
                'MU.10-005 (เกลือบริโภค)',
                'MU.10-006 (น้ำบริโภค)',
                'MU.10-007 (โคลิฟอร์ม SI-2)',
                'MU.10-008 (ตรวจฉลาก)'
            ],
            datasets: [{
                label: 'จำนวนตัวอย่างสะสม',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(15, 23, 42, 0.08)',
                borderColor: '#0f172a',
                borderWidth: 1.5,
                borderRadius: 4,
                barPercentage: 0.7
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { family: 'Sarabun' }
                    },
                    grid: { color: '#f1f5f9' }
                },
                y: {
                    ticks: {
                        font: { family: 'Sarabun', size: 11 }
                    },
                    grid: { display: false }
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
        'MU.10-005', 'MU.10-006', 'MU.10-007', 'MU.10-008'
    ];
    const formCounts = forms.map(f => 
        samples.filter(s => s.form_type === f).length
    );

    formTypeChartInstance.data.datasets[0].data = formCounts;
    
    // Dynamically colour horizontal bars to match theme
    formTypeChartInstance.data.datasets[0].backgroundColor = formCounts.map((count, index) => {
        return index % 2 === 0 ? 'rgba(13, 148, 136, 0.8)' : 'rgba(30, 41, 59, 0.8)';
    });
    formTypeChartInstance.update();
}
