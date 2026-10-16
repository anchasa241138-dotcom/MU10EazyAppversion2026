const fs = require('fs');
let text = fs.readFileSync('temp_save.txt', 'utf8');

const targetStr = `                  if (totalCount === 0) {
                      ['borax', 'formalin', 'bleach', 'salicylic', 'agonist'].forEach(key => {
                          const interpEl = document.getElementById('analysis-interpretation-1-' + key);
                          if (interpEl) {
                              totalCount++;
                              sample['analysis_interpretation_1_' + key] = interpEl.value;
                              sample['analysis_details_1_' + key] = document.getElementById('analysis-detail-results-1-' + key)?.value || '';`;

console.log(text.includes('analysis_details_1_'));