const fs = require('fs');
let js = fs.readFileSync('app_v51.js', 'utf8');

const regex = /else if \(sample\.form_type === 'MU\.10-003'\) \{/;
const replacement = `else if (sample.form_type === 'MU.10-003') {
            const receiveDate = new Date(sample.lab_receive_date || sample.created_at).toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'});
            const analysisDate = sample.analysis_date ? new Date(sample.analysis_date).toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'}) : '-';
            let remarkText = '';`;

if(regex.test(js)) {
    js = js.replace(regex, replacement);
    fs.writeFileSync('app_v51.js', js, 'utf8');
    console.log("Fixed ReferenceError");
} else {
    console.log("Failed to find target");
}
