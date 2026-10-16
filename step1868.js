const fs = require('fs');
let text = fs.readFileSync('app_v83.js', 'utf8');

const targetStr = `              } else if (sample.form_type === 'MU.10-005') {
                  sampleItems.push({ distributor:'', food_type:'', food_serial_no:'', manufacturer_info:'', has_mfg_exp:'', net_weight:'', has_storage_warning:'', label_summary:'', iodate_value:'', test_outcome:'' });
              } else {`;
console.log(text.indexOf(`              } else if (sample.form_type === 'MU.10-005') {`));