const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const regexOld = /<div style="display:flex; justify-content:space-between; margin-bottom:5px;">\s*<div style="flex:1;">หน่วยงานที่เก็บตัวอย่าง: \$\{sample\.agency \|\| '................................................'\}<\/div>\s*<div style="flex:1; text-align:right;">สถานที่เก็บตัวอย่าง: \$\{sample\.location_name \|\| '................................................'\}<\/div>\s*<\/div>\s*<div style="display:flex; justify-content:space-between; margin-bottom:15px;">\s*<div style="flex:1;">ตำบล: \$\{sample\.tambon \|\| '...................'\} อำเภอ: \$\{sample\.amphoe \|\| '...................'\} จังหวัด: \$\{sample\.province \|\| '...................'\}<\/div>\s*<div style="flex:1; text-align:right;">วันที่เก็บตัวอย่าง: \$\{samplingDate \|\| '............................................'\}<\/div>\s*<\/div>/g;

const newHeaderStr = `<table style="width:100%; margin-bottom:12px; font-size:13px; color:#000; border:none; border-collapse:collapse;">
                              <tr>
                                  <td style="width:50%; padding:4px 0;">หน่วยงานที่เก็บตัวอย่าง \${sample.agency ? '....<u>' + sample.agency + '</u>....' : '.....................................................................'}</td>
                                  <td style="width:50%; text-align:right; padding:4px 0;">สถานที่เก็บตัวอย่าง \${sample.location_name ? '....<u>' + sample.location_name + '</u>....' : '.................................................................'}</td>
                              </tr>
                              <tr>
                                  <td style="width:50%; padding:4px 0;">ตำบล \${sample.tambon ? '....<u>' + sample.tambon + '</u>....' : '...................'} อำเภอ \${sample.amphoe ? '....<u>' + sample.amphoe + '</u>....' : '...................'} จังหวัด \${sample.province ? '....<u>' + sample.province + '</u>....' : '...................'}</td>
                                  <td style="width:50%; text-align:right; padding:4px 0;">วันที่เก็บตัวอย่าง \${samplingDate ? '....<u>' + samplingDate + '</u>....' : '.................................................................'}</td>
                              </tr>
                          </table>`;

js = js.replace(regexOld, newHeaderStr);

fs.writeFileSync('app_v83.js', js);
console.log('Replaced all header formatting properly');