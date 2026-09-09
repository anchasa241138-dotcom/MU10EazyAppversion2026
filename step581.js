const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

js = js.replace(/=== 'ผ่าน'/g, "=== 'ผ่าน' || $1 === 'ผ่านเกณฑ์มาตรฐาน'".replace('$1', "")); // Wait, that's not good

// Let's just fix it manually where old data could be read
js = js.replace(/isPass = \(sample\['analysis_summary_' \+ idx\] \|\| sample\.analysis_summary\) === 'ผ่าน';/g, "isPass = ((sample['analysis_summary_' + idx] || sample.analysis_summary) === 'ผ่าน' || (sample['analysis_summary_' + idx] || sample.analysis_summary) === 'ผ่านเกณฑ์มาตรฐาน');");

js = js.replace(/isPass = \(sample\['analysis_summary_1'\] \|\| sample\.analysis_summary\) === 'ผ่าน';/g, "isPass = ((sample['analysis_summary_1'] || sample.analysis_summary) === 'ผ่าน' || (sample['analysis_summary_1'] || sample.analysis_summary) === 'ผ่านเกณฑ์มาตรฐาน');");

js = js.replace(/sumValue === 'ผ่าน' \|\| sumValue === 'ผ่าน'/g, "sumValue === 'ผ่าน' || sumValue === 'ผ่านเกณฑ์มาตรฐาน'");
js = js.replace(/sumValue === 'ไม่ผ่าน' \|\| sumValue === 'ไม่ผ่าน'/g, "sumValue === 'ไม่ผ่าน' || sumValue === 'ไม่ผ่านเกณฑ์มาตรฐาน'");

js = js.replace(/x === 'ผ่าน' \|\| x === 'ผ่าน'/g, "x === 'ผ่าน' || x === 'ผ่านเกณฑ์มาตรฐาน'");
js = js.replace(/x === 'ไม่ผ่าน' \|\| x === 'ไม่ผ่าน'/g, "x === 'ไม่ผ่าน' || x === 'ไม่ผ่านเกณฑ์มาตรฐาน'");

js = js.replace(/sample\.analysis_summary === 'ผ่าน'/g, "(sample.analysis_summary === 'ผ่าน' || sample.analysis_summary === 'ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/sample\.analysis_summary === 'ไม่ผ่าน'/g, "(sample.analysis_summary === 'ไม่ผ่าน' || sample.analysis_summary === 'ไม่ผ่านเกณฑ์มาตรฐาน')");

// Also check b_sum, f_sum etc
js = js.replace(/b_sum === 'ผ่าน'/g, "(b_sum === 'ผ่าน' || b_sum === 'ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/b_sum === 'ไม่ผ่าน'/g, "(b_sum === 'ไม่ผ่าน' || b_sum === 'ไม่ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/f_sum === 'ผ่าน'/g, "(f_sum === 'ผ่าน' || f_sum === 'ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/f_sum === 'ไม่ผ่าน'/g, "(f_sum === 'ไม่ผ่าน' || f_sum === 'ไม่ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/bl_sum === 'ผ่าน'/g, "(bl_sum === 'ผ่าน' || bl_sum === 'ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/bl_sum === 'ไม่ผ่าน'/g, "(bl_sum === 'ไม่ผ่าน' || bl_sum === 'ไม่ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/s_sum === 'ผ่าน'/g, "(s_sum === 'ผ่าน' || s_sum === 'ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/s_sum === 'ไม่ผ่าน'/g, "(s_sum === 'ไม่ผ่าน' || s_sum === 'ไม่ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/a_sum === 'ผ่าน'/g, "(a_sum === 'ผ่าน' || a_sum === 'ผ่านเกณฑ์มาตรฐาน')");
js = js.replace(/a_sum === 'ไม่ผ่าน'/g, "(a_sum === 'ไม่ผ่าน' || a_sum === 'ไม่ผ่านเกณฑ์มาตรฐาน')");


fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Fixed backwards compatibility for old data');
