const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const replacement = `
            // Save individual signature formats and custom drawings
            const roles = ['analyst-1', 'analyst-2', 'approver-1'];
            roles.forEach(roleId => {
                const dbKey = roleId.replace('-', '_'); // analyst_1
                const modeEl = document.getElementById('mode-' + roleId);
                if (modeEl) {
                    const mode = modeEl.value;
                    sample['mode_' + dbKey] = mode;
                    
                    if (mode === 'draw') {
                        const canvas = document.getElementById('canvas-' + roleId);
                        if (canvas) sample['sig_' + dbKey] = canvas.toDataURL();
                    } else {
                        sample['sig_' + dbKey] = null;
                    }
                }
            });
`;

js = js.replace(/\/\/ Save signature format and custom drawing if present[\s\S]*?if \(document\.getElementById\('hybridSignaturePad'\)\) \{[\s\S]*?\}\s*\}/, replacement);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Updated handleApproveReport logic');
