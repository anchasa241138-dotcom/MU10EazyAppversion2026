const fs = require('fs');
let content = fs.readFileSync('test_pdf.js', 'utf8');
content = content.replace("app.generatePDF({ form_type: 'MU.10-005', ref_id: '123' }, true);", "app.generateCertificatePDF({ form_type: 'MU.10-005', ref_id: '123', location_name: 'test' }, true);");
fs.writeFileSync('test_pdf.js', content);