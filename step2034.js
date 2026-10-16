const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

const oldCode = `// 3. Calculate Form type distribution
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
}`;

const newCode = `// 3. Calculate Form type distribution (now by 9 specific substances)
    // Call Substance Charts Update first to get stats
    let stats = null;
    if (typeof updateSubstanceCharts === 'function') {
        stats = updateSubstanceCharts(samples);
    }
    
    if (stats && formTypeChartInstance) {
        const keys = ['pesticide', 'borax', 'formalin', 'bleach', 'salicylic', 'agonist', 'polar', 'coliformFood', 'coliformWater'];
        const passedCounts = keys.map(k => stats[k].pass);
        const failedCounts = keys.map(k => stats[k].fail);

        formTypeChartInstance.data.datasets[0].data = passedCounts;
        formTypeChartInstance.data.datasets[1].data = failedCounts;
        formTypeChartInstance.update();
    }
}`;

js = js.replace(oldCode, newCode);
fs.writeFileSync('charts-dash.js', js);
console.log("Updated updateDashboardCharts logic");