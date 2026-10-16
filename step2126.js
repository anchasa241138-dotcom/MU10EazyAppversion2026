const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

// 1. Fix the update location
// It is currently inside `if (grid.children.length === 0) { ... }`
// Let's remove it from there
js = js.replace(/    if \(typeof formTypeChartInstance !== 'undefined' && formTypeChartInstance\) \{\r?\n        const passedCounts = Object\.values\(stats\)\.map\(s => s\.pass\);\r?\n        const failedCounts = Object\.values\(stats\)\.map\(s => s\.fail\);\r?\n        formTypeChartInstance\.data\.labels = Object\.values\(stats\)\.map\(s => s\.label\);\r?\n        formTypeChartInstance\.data\.datasets\[0\]\.data = passedCounts;\r?\n        formTypeChartInstance\.data\.datasets\[1\]\.data = failedCounts;\r?\n        formTypeChartInstance\.update\(\);\r?\n    \}\r?\n/s, "");

// And insert it right BEFORE `if (grid.children.length === 0) {`
const insertCode = `    if (typeof formTypeChartInstance !== 'undefined' && formTypeChartInstance) {
        const passedCounts = Object.values(stats).map(s => s.pass);
        const failedCounts = Object.values(stats).map(s => s.fail);
        formTypeChartInstance.data.labels = Object.values(stats).map(s => s.label);
        formTypeChartInstance.data.datasets[0].data = passedCounts;
        formTypeChartInstance.data.datasets[1].data = failedCounts;
        formTypeChartInstance.update();
    }
`;

js = js.replace(/    \/\/ Check if we need to build the DOM\r?\n    if \(grid\.children\.length === 0\) \{/, insertCode + "\n    // Check if we need to build the DOM\n    if (grid.children.length === 0) {");

fs.writeFileSync('charts-dash.js', js);
console.log('Fixed chart update location');