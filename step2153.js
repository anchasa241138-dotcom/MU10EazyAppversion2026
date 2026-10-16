const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const mu1008SampleItemsPush = `            } else if (sample.form_type === 'MU.10-008') {
                sampleItems.push({
                    distributor: sample[\`distributor_\${idx}\`] || '',
                    name: sample[\`sample_name_\${idx}\`] || '',
                    food_serial_no: sample[\`food_serial_no_\${idx}\`] || '',
                    manufacturer_info: sample[\`manufacturer_info_\${idx}\`] || '',
                    has_ingredient_pct: sample[\`has_ingredient_pct_\${idx}\`] || '',
                    has_mfg_exp: sample[\`has_mfg_exp_\${idx}\`] || '',
                    net_weight: sample[\`net_weight_\${idx}\`] || '',
                    label_summary: sample[\`label_summary_\${idx}\`] || ''
                });
`;

// Inject into the loop
// Replace `} else if (sample.form_type === 'MU.10-005') {`
const regexItemsPush = /            \} else if \(sample\.form_type === 'MU\.10-005'\) \{\s*sampleItems\.push\(\{/g;
js = js.replace(regexItemsPush, mu1008SampleItemsPush + "            } else if (sample.form_type === 'MU.10-005') {\n                sampleItems.push({");


// Also ensure at least 5 rows for the table for MU.10-008
const mu1008EmptyPush = `            } else if (sample.form_type === 'MU.10-008') {
                sampleItems.push({ distributor:'', name:'', food_serial_no:'', manufacturer_info:'', has_ingredient_pct:'', has_mfg_exp:'', net_weight:'', label_summary:'' });
`;
const regexEmptyPush = /            \} else if \(sample\.form_type === 'MU\.10-005'\) \{\s*sampleItems\.push\(\{ distributor:'', food_type:'', food_serial_no:''/g;
js = js.replace(regexEmptyPush, mu1008EmptyPush + "            } else if (sample.form_type === 'MU.10-005') {\n                sampleItems.push({ distributor:'', food_type:'', food_serial_no:''");


fs.writeFileSync('app_v83.js', js);
console.log('Injected sampleItems push logic for MU.10-008');