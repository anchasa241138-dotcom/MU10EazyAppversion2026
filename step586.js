const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

// Replace the old global toggleSignMode, initSignaturePad, clearSignaturePad
const newPadLogic = `
    signaturePads: {},

    toggleSignMode(roleId) {
        if (!roleId) return; // safety
        const mode = document.getElementById('mode-' + roleId).value;
        const container = document.getElementById('draw-container-' + roleId);
        
        if (mode === 'draw') {
            container.style.display = 'block';
            this.initSignaturePad(roleId);
        } else {
            container.style.display = 'none';
        }
    },

    initSignaturePad(roleId) {
        const canvas = document.getElementById('canvas-' + roleId);
        if (!canvas) return;

        // Resize canvas correctly to prevent squishing
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        // Only resize if width is 0 or needs update, to prevent clearing on every toggle
        if (canvas.width === 0 || canvas.width !== canvas.offsetWidth * ratio) {
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        }

        // Initialize or re-enable
        if (typeof SignaturePad !== 'undefined') {
            if (!this.signaturePads[roleId]) {
                this.signaturePads[roleId] = new SignaturePad(canvas, {
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    penColor: 'rgb(0, 0, 128)' // Dark blue pen
                });
            }
        }
    },

    clearSignaturePad(roleId) {
        if (this.signaturePads && this.signaturePads[roleId]) {
            this.signaturePads[roleId].clear();
        }
    },
`;

js = js.replace(/    toggleSignMode\(\) \{[\s\S]*?clearSignaturePad\(\) \{[\s\S]*?    \},/, newPadLogic);

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Replaced pad logic');
