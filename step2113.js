const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

const replaceCode = `    if (typeof formTypeChartInstance !== 'undefined' && formTypeChartInstance) {
        const passedCounts = Object.values(stats).map(s => s.pass);
        const failedCounts = Object.values(stats).map(s => s.fail);
        formTypeChartInstance.data.labels = Object.values(stats).map(s => s.label);
        formTypeChartInstance.data.datasets[0].data = passedCounts;
        formTypeChartInstance.data.datasets[1].data = failedCounts;
        formTypeChartInstance.update();
    }
    
    for (const key in stats) {
        const item = stats[key];`;

js = js.replace(/for \(\s*const key in stats\s*\) \{\s*const item = stats\[key\];/, replaceCode);

fs.writeFileSync('charts-dash.js', js);
console.log('Fixed formTypeChartInstance logic properly');