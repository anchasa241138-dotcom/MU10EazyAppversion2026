const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

// Remove the injected block from the top
js = js.replace(/    if \(typeof formTypeChartInstance !== 'undefined' && formTypeChartInstance\) \{\r?\n        const passedCounts = Object\.values\(stats\)\.map\(s => s\.pass\);\r?\n        const failedCounts = Object\.values\(stats\)\.map\(s => s\.fail\);\r?\n        formTypeChartInstance\.data\.labels = Object\.values\(stats\)\.map\(s => s\.label\);\r?\n        formTypeChartInstance\.data\.datasets\[0\]\.data = passedCounts;\r?\n        formTypeChartInstance\.data\.datasets\[1\]\.data = failedCounts;\r?\n        formTypeChartInstance\.update\(\);\r?\n    \}\r?\n    \r?\n/s, "");

// Add it to the end of updateSubstanceCharts (before the function closing bracket)
// Let's find the end of the function by searching for the DOM update loop:
// for (const key in stats) { const item = stats[key]; ... }
const insertCode = 
    if (typeof formTypeChartInstance !== 'undefined' && formTypeChartInstance) {
        const passedCounts = Object.values(stats).map(s => s.pass);
        const failedCounts = Object.values(stats).map(s => s.fail);
        formTypeChartInstance.data.labels = Object.values(stats).map(s => s.label);
        formTypeChartInstance.data.datasets[0].data = passedCounts;
        formTypeChartInstance.data.datasets[1].data = failedCounts;
        formTypeChartInstance.update();
    }
;

js = js.replace(/(for \(\s*const key in stats\s*\) \{\s*const item = stats\[key\];)/, insertCode + "\n    ");

fs.writeFileSync('charts-dash.js', js);