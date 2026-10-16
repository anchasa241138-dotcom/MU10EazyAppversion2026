const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

const target = "let htmlContent = '';";
let pos = js.indexOf(target);
console.log('Pos of let htmlContent = \'\':', pos);

let afterPos = js.indexOf("if (sample.form_type === 'MU.10-004')", pos);
console.log('Pos of if MU.10-004:', afterPos);

// Print the structure of this if / else if chain
let idx = afterPos;
while (idx !== -1 && idx < pos + 60000) {
    let nextElse = js.indexOf("} else if (sample.form_type ===", idx + 1);
    let nextElseOnly = js.indexOf("} else {", idx + 1);
    console.log('Next branch:', js.substring(idx, idx + 45));
    if (nextElse !== -1 && (nextElseOnly === -1 || nextElse < nextElseOnly)) {
        idx = nextElse + 2;
    } else if (nextElseOnly !== -1) {
        idx = nextElseOnly + 2;
        console.log('Final else branch:', js.substring(idx, idx + 45));
        break;
    } else {
        break;
    }
}