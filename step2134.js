const fs = require('fs');
let css = fs.readFileSync('style_v3.css', 'utf8');

const regex = /\.form-select-card \{[\s\S]*?\.form-select-card:hover span \{\s*color: #2563eb;\s*\}/;

const neumorphismCSS = `.form-select-card {
    background: var(--bg-light);
    border: none;
    border-radius: 28px;
    padding: 40px 25px;
    width: 260px;
    flex: 0 0 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    outline: none;
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.8), 10px 10px 20px rgba(163, 177, 198, 0.4);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.form-select-card::before {
    display: none;
}

.form-select-card:hover {
    transform: translateY(0) scale(0.98);
    box-shadow: inset -8px -8px 16px rgba(255, 255, 255, 0.8), inset 8px 8px 16px rgba(163, 177, 198, 0.4);
}

.form-card-badge {
    position: absolute;
    top: 18px;
    right: 18px;
    left: auto;
    background: var(--bg-light);
    color: #64748b;
    font-size: 11px;
    font-weight: 800;
    padding: 6px 14px;
    border-radius: 20px;
    font-family: 'Sarabun', sans-serif;
    letter-spacing: 0.5px;
    border: none;
    z-index: 1;
    transition: all 0.3s ease;
    box-shadow: -3px -3px 8px rgba(255, 255, 255, 0.8), 3px 3px 8px rgba(163, 177, 198, 0.4);
}

.form-select-card:hover .form-card-badge {
    color: #2563eb;
    box-shadow: inset -3px -3px 6px rgba(255, 255, 255, 0.8), inset 3px 3px 6px rgba(163, 177, 198, 0.4);
}

.form-icon {
    width: 86px;
    height: 86px;
    border-radius: 50%;
    background: var(--bg-light);
    color: #64748b;
    font-size: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: -6px -6px 12px rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(163, 177, 198, 0.4);
    transition: all 0.3s ease;
    z-index: 1;
    position: relative;
}

.form-select-card:hover .form-icon {
    transform: scale(0.95);
    box-shadow: inset -4px -4px 8px rgba(255, 255, 255, 0.8), inset 4px 4px 8px rgba(163, 177, 198, 0.4);
}

.form-select-card[data-form-type="MU.10-001"] .form-icon { color: #059669; }
.form-select-card[data-form-type="MU.10-002"] .form-icon { color: #d97706; }
.form-select-card[data-form-type="MU.10-003"] .form-icon { color: #2563eb; }
.form-select-card[data-form-type="MU.10-004"] .form-icon { color: #7c3aed; }
.form-select-card[data-form-type="MU.10-005"] .form-icon { color: #db2777; }
.form-select-card[data-form-type="MU.10-006"] .form-icon { color: #0284c7; }
.form-select-card[data-form-type="MU.10-007"] .form-icon { color: #e11d48; }

.form-select-card span {
    font-size: 17px;
    font-weight: 700;
    color: #475569;
    margin-top: 5px;
    z-index: 1;
    position: relative;
    transition: color 0.3s ease;
}

.form-select-card:hover span {
    color: #2563eb;
}`;

if (regex.test(css)) {
    css = css.replace(regex, neumorphismCSS);
    fs.writeFileSync('style_v3.css', css);
    console.log('Successfully replaced form card CSS with Neumorphism.');
} else {
    console.log('Regex did not match!');
}