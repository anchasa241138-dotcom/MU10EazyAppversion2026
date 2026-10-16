const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// 1. Inject sampleItems.push extraction
const extractTarget = `} else if (sample.form_type === 'MU.10-008') {
                sampleItems.push({
                    distributor: sample[\`distributor_\${idx}\`] || '',`;

const extractRepl = `} else if (sample.form_type === 'MU.10-006') {
                sampleItems.push({
                    amphoe: sample[\`amphoe_\${idx}\`] || '',
                    location: sample[\`location_\${idx}\`] || '',
                    sample_name: sample[\`sample_name_\${idx}\`] || '',
                    company: sample[\`company_\${idx}\`] || '',
                    system: sample[\`system_\${idx}\`] || '',
                    ocpb_advice: sample[\`ocpb_advice_\${idx}\`] === 'on' || sample[\`ocpb_advice_\${idx}\`] === true,
                    ocpb_filter_date: sample[\`ocpb_filter_date_\${idx}\`] === 'on' || sample[\`ocpb_filter_date_\${idx}\`] === true,
                    ocpb_warning: sample[\`ocpb_warning_\${idx}\`] === 'on' || sample[\`ocpb_warning_\${idx}\`] === true,
                    claim_magnetic: sample[\`claim_magnetic_\${idx}\`] === 'on' || sample[\`claim_magnetic_\${idx}\`] === true,
                    claim_molecule: sample[\`claim_molecule_\${idx}\`] === 'on' || sample[\`claim_molecule_\${idx}\`] === true,
                    claim_other: sample[\`claim_other_\${idx}\`] || '',
                    remark: sample[\`remark_\${idx}\`] || ''
                });
            } else if (sample.form_type === 'MU.10-008') {
                sampleItems.push({
                    distributor: sample[\`distributor_\${idx}\`] || '',`;

js = js.replace(extractTarget, extractRepl);

// 2. Inject fallback extraction (padding)
const padTarget = `} else if (sample.form_type === 'MU.10-008') {
                sampleItems.push({ distributor:'', name:'', food_serial_no:'', manufacturer_info:'', has_ingredient_pct:'', has_mfg_exp:'', net_weight:'', label_summary:'' });
            } else if (sample.form_type === 'MU.10-005') {`;

const padRepl = `} else if (sample.form_type === 'MU.10-006') {
                sampleItems.push({ amphoe:'', location:'', sample_name:'', company:'', system:'', ocpb_advice:false, ocpb_filter_date:false, ocpb_warning:false, claim_magnetic:false, claim_molecule:false, claim_other:'', remark:'' });
            } else if (sample.form_type === 'MU.10-008') {
                sampleItems.push({ distributor:'', name:'', food_serial_no:'', manufacturer_info:'', has_ingredient_pct:'', has_mfg_exp:'', net_weight:'', label_summary:'' });
            } else if (sample.form_type === 'MU.10-005') {`;

js = js.replace(padTarget, padRepl);

fs.writeFileSync('app_v83.js', js);
console.log('Injected extraction');