const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

js = js.replace(/const s1 = document\.getElementById\('sel-analyst-1'\);/, 
`const s1 = document.getElementById('sel-analyst-1');
                    const s2 = document.getElementById('sel-analyst-2');
                    const a1 = document.getElementById('sel-approver-1');
                    const a2 = document.getElementById('sel-approver-2');
                    s1.onchange = () => this.checkSignaturePadVisibility();
                    s2.onchange = () => this.checkSignaturePadVisibility();
                    a1.onchange = () => this.checkSignaturePadVisibility();
                    a2.onchange = () => this.checkSignaturePadVisibility();
                    
                    // Reset pad when opening
                    this.clearSignaturePad();
                    this.checkSignaturePadVisibility();`);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Added onchange listeners to JS');
