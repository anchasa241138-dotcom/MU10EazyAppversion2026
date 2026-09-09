const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');

const canvasLogic = `
    initSignaturePad() {
        const canvas = document.getElementById('hybridSignaturePad');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        let drawing = false;
        let lastPos = {x: 0, y: 0};
        
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const startDraw = (e) => {
            e.preventDefault();
            drawing = true;
            lastPos = getPos(e);
        };
        const draw = (e) => {
            if(!drawing) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            lastPos = pos;
        };
        const stopDraw = (e) => {
            if (drawing) e.preventDefault();
            drawing = false;
        };

        canvas.onmousedown = startDraw;
        canvas.onmousemove = draw;
        canvas.onmouseup = stopDraw;
        canvas.onmouseout = stopDraw;
        
        canvas.ontouchstart = startDraw;
        canvas.ontouchmove = draw;
        canvas.ontouchend = stopDraw;
        canvas.ontouchcancel = stopDraw;
    },
    clearSignaturePad() {
        const canvas = document.getElementById('hybridSignaturePad');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
`;

js = js.replace(/toggleSignMode\(\) \{/, canvasLogic + '    toggleSignMode() {');

fs.writeFileSync('app_v49_23.js', js, 'utf8');
console.log('Re-added initSignaturePad');
