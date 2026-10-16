const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Force display block on auth-subform
html = html.replace('#authModal .modal-body {', '#authModal .auth-subform.active { display: block !important; }\n        #authModal .auth-subform.active > * { margin-bottom: 15px; }\n        #authModal .modal-body {');

// Revert button color
html = html.replace('<button type="submit" class="btn btn-primary btn-block mt-4" style="height: 100px; background: red !important; font-size: 24px; color: white;">ลงทะเบียนสมัครสมาชิก (TEST BUTTON)</button>',
'<button type="submit" class="btn btn-primary btn-block mt-4" style="height: 54px; font-size: 18px; margin-top: 20px !important;">ลงทะเบียนสมัครสมาชิก</button>');

// Remove the padding-bottom I added in the previous step
html = html.replace('<form id="registerForm" class="auth-subform" style="padding-bottom: 30px;">', '<form id="registerForm" class="auth-subform">');

// Bump version
html = html.replace(/charts-dash\.js\?v=\d+/, `charts-dash.js?v=${Date.now()}`);

fs.writeFileSync('index.html', html);
console.log("Fixed flexbox bug for auth-subform");