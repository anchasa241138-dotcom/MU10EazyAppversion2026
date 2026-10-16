const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const regexMiddle = /<div>ลงชื่อผู้ตรวจวิเคราะห์ \.\.\.\.\$\{sample\.analysis_analyst \? '<u>' \+ sample\.analysis_analyst \+ '<\/u>' : '\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.'\}\.\.\.\. , \.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.<\/div>/g;
js = js.replace(regexMiddle, '<div>ลงชื่อผู้ตรวจวิเคราะห์ ....${sample.analysis_analyst ? \'<u>\' + sample.analysis_analyst + \'</u>\' : \'................................................\'}....</div>');

fs.writeFileSync('app_v83.js', js);
console.log('Fixed analyst signature line');