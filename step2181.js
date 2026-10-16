const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const targetStr = "document.getElementById('formNameTitle').innerText = title;";

const toggleCode = `
        const toggleField = (id, show) => {
            const el = document.getElementById(id);
            if (el) {
                const group = el.closest('.form-group');
                if (group) group.style.display = show ? '' : 'none';
                if (!show) el.removeAttribute('required');
                else el.setAttribute('required', 'required');
            }
        };
        const isMu10006 = formType === 'MU.10-006';
        toggleField('field-agency', !isMu10006);
        toggleField('field-location-type', !isMu10006);
        toggleField('field-collector-name', !isMu10006);
        toggleField('field-collector-position', !isMu10006);
        
`;

js = js.replace(targetStr, toggleCode + targetStr);
fs.writeFileSync('app_v83.js', js);
console.log('Injected toggle logic');