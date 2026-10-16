const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const regex = /this\.samples = Array\.isArray\(data\) \? data : Object\.values\(data\);/g;
const replacement = `this.samples = Array.isArray(data) ? data : Object.values(data);
                    
                    let hasMigration = false;
                    this.samples.forEach(s => {
                        if (s.form_type === 'MU.10-008' && (s.status === 'pending' || s.status === 'verified' || s.status === 'lab_received' || s.status === 'analyzed')) {
                            s.status = 'summarized';
                            if (!s.lab_receive_date) s.lab_receive_date = new Date().toISOString().split('T')[0];
                            if (!s.lab_receive_timestamp) s.lab_receive_timestamp = new Date().toISOString();
                            if (!s.analysis_date) s.analysis_date = new Date().toISOString().split('T')[0];
                            if (!s.analysis_timestamp) s.analysis_timestamp = new Date().toISOString();
                            if (!s.sel_analyst_1) s.sel_analyst_1 = 'anchasa';
                            if (!s.sel_analyst_2) s.sel_analyst_2 = 'surachai';
                            if (!s.sel_approver_1) s.sel_approver_1 = 'thitiporn';
                            if (!s.sel_approver_2) s.sel_approver_2 = 'mallika';
                            if (!s.lab_id) {
                                const year = new Date().getFullYear() + 543;
                                const prefix = this.getProvincePrefix(s.province) || 'UNK';
                                const count = this.samples.filter(st => st.lab_id && st.lab_id.startsWith(prefix)).length + 1;
                                s.lab_id = \`\${prefix}-\${year}-\${String(count).padStart(4, '0')}\`;
                            }
                            hasMigration = true;
                        }
                    });
                    if (hasMigration) {
                        db.ref('samples').set(this.samples);
                    }`;

js = js.replace(regex, replacement);
fs.writeFileSync('app_v83.js', js);
console.log('Injected MU.10-008 migration script');