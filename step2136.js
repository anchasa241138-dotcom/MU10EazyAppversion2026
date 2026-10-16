const fs = require('fs');
let css = fs.readFileSync('style_v3.css', 'utf8');

const regex = /\.form-select-card \{[\s\S]*?\.form-select-card:hover span \{\s*color: #2563eb;\s*\}/;

const horizontalCSS = `.form-select-card {
    background: #ffffff;
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 16px;
    padding: 16px 20px;
    width: 100%;
    flex: 1 1 340px;
    max-width: 450px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    outline: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.form-select-card::before {
    display: none;
}

.form-select-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(37, 99, 235, 0.08);
    border-color: rgba(37, 99, 235, 0.3);
}

.form-card-badge {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background: #f1f5f9;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    font-family: 'Sarabun', sans-serif;
    letter-spacing: 0.5px;
    border: none;
    z-index: 1;
    transition: all 0.3s ease;
    box-shadow: none;
}

.form-select-card:hover .form-card-badge {
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
}

.form-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    color: white;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
    margin-right: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    z-index: 1;
    position: relative;
    flex-shrink: 0;
}

.form-select-card:hover .form-icon {
    transform: scale(1.1) rotate(5deg);
}

/* Gradient background for icons */
.form-select-card[data-form-type="MU.10-001"] .form-icon { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 8px 15px rgba(16,185,129,0.25); }
.form-select-card[data-form-type="MU.10-002"] .form-icon { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 8px 15px rgba(245,158,11,0.25); }
.form-select-card[data-form-type="MU.10-003"] .form-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 8px 15px rgba(59,130,246,0.25); }
.form-select-card[data-form-type="MU.10-004"] .form-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 8px 15px rgba(139,92,246,0.25); }
.form-select-card[data-form-type="MU.10-005"] .form-icon { background: linear-gradient(135deg, #ec4899, #db2777); box-shadow: 0 8px 15px rgba(236,72,153,0.25); }
.form-select-card[data-form-type="MU.10-006"] .form-icon { background: linear-gradient(135deg, #0ea5e9, #0284c7); box-shadow: 0 8px 15px rgba(14,165,233,0.25); }
.form-select-card[data-form-type="MU.10-007"] .form-icon { background: linear-gradient(135deg, #f43f5e, #e11d48); box-shadow: 0 8px 15px rgba(244,63,94,0.25); }

.form-select-card span {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 0;
    z-index: 1;
    position: relative;
    transition: color 0.3s ease;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 75px; /* leave room for badge on the right */
}

.form-select-card:hover span {
    color: #2563eb;
}`;

if (regex.test(css)) {
    css = css.replace(regex, horizontalCSS);
    fs.writeFileSync('style_v3.css', css);
    console.log('Successfully replaced form card CSS with Horizontal List.');
} else {
    console.log('Regex did not match!');
}