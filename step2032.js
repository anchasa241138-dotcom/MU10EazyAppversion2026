const fs = require('fs');
let js = fs.readFileSync('charts-dash.js', 'utf8');

const oldSubUpdate = `        substanceChartInstances[key] = new Chart(ctx, {`;
// Wait, I just need to return stats at the end of updateSubstanceCharts
const endUpdateSub = `        }
    }
}

// Global functions for modal`;

const newEndUpdateSub = `        }
    }
    return stats;
}

// Global functions for modal`;

js = js.replace(endUpdateSub, newEndUpdateSub);
fs.writeFileSync('charts-dash.js', js);
console.log("Returned stats");