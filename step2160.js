const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// 1. Fix the logo (global replace)
js = js.replace(/<img src="https:\/\/raw\.githubusercontent\.com\/anchasa241138-dotcom\/MU10EazyAppversion2026\/refs\/heads\/master\/logo_mobi_new\.jpg"/g, '<img src="data:image/jpeg;base64,${typeof logoBase64 !== \'undefined\' ? logoBase64 : \'\'}"');

// 2. Fix the meta fields mapping
js = js.replace(/\$\{sample\.collector_agency/g, '${sample.agency');
js = js.replace(/\$\{sample\.sampling_location/g, '${sample.location_name');
js = js.replace(/\$\{sample\.sampling_subdistrict/g, '${sample.tambon');
js = js.replace(/\$\{sample\.sampling_district/g, '${sample.amphoe');
js = js.replace(/\$\{sample\.sampling_province/g, '${sample.province');

// 3. Adjust font sizes in table rows
js = js.replace(/<td style="padding:4px; font-size:14px;/g, '<td style="padding:4px; font-size:12px;');
js = js.replace(/<td style="padding:4px; text-align:left; font-size:14px;/g, '<td style="padding:4px; text-align:left; font-size:12px;');

// 4. Adjust top meta fields font size
js = js.replace(/<div style="padding: 10px 15px 15px 15px; font-size:14px;/g, '<div style="padding: 10px 15px 15px 15px; font-size:13px;');

fs.writeFileSync('app_v83.js', js);
console.log('Fixed MU.10-008 PDF design');