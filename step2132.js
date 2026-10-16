const fs = require('fs');
let css = fs.readFileSync('style_v3.css', 'utf8');

// Regex to replace .form-select-card and its children rules
const regex = /\.form-select-card \{[\s\S]*?\.form-select-card:hover span \{\s*color: var\(--primary-light\);\s*\}/;

const modernCSS = `.form-select-card {
    background: #ffffff;
    border: 1px solid rgba(226, 232, 240, 0.6);
    border-radius: 24px;
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.form-select-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at top right, rgba(37,99,235,0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
}

.form-select-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.1);
    border-color: transparent;
}

.form-select-card:hover::before {
    opacity: 1;
}

.form-card-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    left: auto;
    background: #f1f5f9;
    color: #475569;
    font-size: 11px;
    font-weight: 800;
    padding: 6px 12px;
    border-radius: 20px;
    font-family: 'Sarabun', sans-serif;
    letter-spacing: 0.5px;
    border: none;
    z-index: 1;
    transition: all 0.3s ease;
}

.form-select-card:hover .form-card-badge {
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
}

.form-icon {
    width: 84px;
    height: 84px;
    border-radius: 24px;
    background: linear-gradient(135deg, #94a3b8, #64748b);
    color: white;
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 10px 20px rgba(100, 116, 139, 0.2);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1;
    position: relative;
}

/* Vibrant colors for each card based on form type */
.form-select-card[data-form-type="MU.10-001"] .form-icon { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 10px 20px rgba(16,185,129,0.3); }
.form-select-card[data-form-type="MU.10-002"] .form-icon { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 10px 20px rgba(245,158,11,0.3); }
.form-select-card[data-form-type="MU.10-003"] .form-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 10px 20px rgba(59,130,246,0.3); }
.form-select-card[data-form-type="MU.10-004"] .form-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 10px 20px rgba(139,92,246,0.3); }
.form-select-card[data-form-type="MU.10-005"] .form-icon { background: linear-gradient(135deg, #ec4899, #db2777); box-shadow: 0 10px 20px rgba(236,72,153,0.3); }
.form-select-card[data-form-type="MU.10-006"] .form-icon { background: linear-gradient(135deg, #0ea5e9, #0284c7); box-shadow: 0 10px 20px rgba(14,165,233,0.3); }
.form-select-card[data-form-type="MU.10-007"] .form-icon { background: linear-gradient(135deg, #f43f5e, #e11d48); box-shadow: 0 10px 20px rgba(244,63,94,0.3); }

.form-select-card:hover .form-icon {
    transform: scale(1.1) rotate(5deg) translateY(-5px);
}

.form-select-card[data-form-type="MU.10-001"]:hover .form-icon { box-shadow: 0 15px 30px rgba(16,185,129,0.4); }
.form-select-card[data-form-type="MU.10-002"]:hover .form-icon { box-shadow: 0 15px 30px rgba(245,158,11,0.4); }
.form-select-card[data-form-type="MU.10-003"]:hover .form-icon { box-shadow: 0 15px 30px rgba(59,130,246,0.4); }
.form-select-card[data-form-type="MU.10-004"]:hover .form-icon { box-shadow: 0 15px 30px rgba(139,92,246,0.4); }
.form-select-card[data-form-type="MU.10-005"]:hover .form-icon { box-shadow: 0 15px 30px rgba(236,72,153,0.4); }
.form-select-card[data-form-type="MU.10-006"]:hover .form-icon { box-shadow: 0 15px 30px rgba(14,165,233,0.4); }
.form-select-card[data-form-type="MU.10-007"]:hover .form-icon { box-shadow: 0 15px 30px rgba(244,63,94,0.4); }

.form-select-card span {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 5px;
    z-index: 1;
    position: relative;
    transition: color 0.3s ease;
}

.form-select-card:hover span {
    color: #2563eb;
}`;

if (regex.test(css)) {
    css = css.replace(regex, modernCSS);
    fs.writeFileSync('style_v3.css', css);
    console.log('Successfully replaced form card CSS.');
} else {
    console.log('Regex did not match!');
}