const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

// Remove broken formTypeChart update logic from updateDashboardCharts
js = js.replace(/const forms = \[\s*'MU\.10-001', 'MU\.10-002', 'MU\.10-003', 'MU\.10-004',\s*'MU\.10-005', 'MU\.10-006', 'MU\.10-007'\s*\];\s*const passedCounts = forms\.map.*?;\s*const failedCounts = forms\.map.*?;\s*formTypeChartInstance\.data\.datasets\[0\]\.data = passedCounts;\s*formTypeChartInstance\.data\.datasets\[1\]\.data = failedCounts;\s*formTypeChartInstance\.update\(\);/gs, "");

// Add working formTypeChart update logic to updateSubstanceCharts
js = js.replace(/for\(let k in stats\) \{\s*const c = stats\[k\];/, 
    if (typeof formTypeChartInstance !== 'undefined' && formTypeChartInstance) {
        const passedCounts = Object.values(stats).map(s => s.pass);
        const failedCounts = Object.values(stats).map(s => s.fail);
        formTypeChartInstance.data.labels = Object.values(stats).map(s => s.label);
        formTypeChartInstance.data.datasets[0].data = passedCounts;
        formTypeChartInstance.data.datasets[1].data = failedCounts;
        formTypeChartInstance.update();
    }
    
    for(let k in stats) {
        const c = stats[k];);

fs.writeFileSync('charts-dash.js', js);