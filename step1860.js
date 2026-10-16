const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const targetStr = `            if (sample.analysis_comment) {
                const commentEl = document.getElementById('analysis-comment');
                if (commentEl) commentEl.value = sample.analysis_comment;
            }
        } else {
            // Generic form for other form types`;
            
if (js.includes(targetStr)) {
    console.log("Found the target spot!");
} else {
    console.log("Could not find the target spot.");
    console.log(js.indexOf('Generic form for other form types'));
}