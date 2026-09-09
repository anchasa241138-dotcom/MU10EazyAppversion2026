const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

js = js.replace(/if \(mode === 'draw' && sample\['sig_' \+ dbKey\] && canvas\) \{/g, `if (mode === 'draw' && canvas) {
                        if (sample['sig_' + dbKey]) {`);
                        
js = js.replace(/img\.src = sample\['sig_' \+ dbKey\];\n                    \}/g, `img.src = sample['sig_' + dbKey];
                        } else {
                            if(this.signaturePads && this.signaturePads[roleId]) {
                                this.signaturePads[roleId].clear();
                            }
                        }
                    }`);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
