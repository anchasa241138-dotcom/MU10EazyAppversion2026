const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Render a test version where we force the button to be gigantic and red
html = html.replace('<button type="submit" class="btn btn-primary btn-block mt-4" style="height: 54px; font-size: 18px;">ลงทะเบียนสมัครสมาชิก</button>',
'<button type="submit" class="btn btn-primary btn-block mt-4" style="height: 100px; background: red !important; font-size: 24px; color: white;">ลงทะเบียนสมัครสมาชิก (TEST BUTTON)</button>');

fs.writeFileSync('index.html', html);
console.log("Modified button");