const fs = require('fs');
let css = fs.readFileSync('style_v3.css', 'utf8');

// Replace .form-selection-grid
const gridRegex = /\.form-selection-grid \{[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\}\s*\}/;
const newGrid = `.form-selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 20px;
    padding: 20px 10px;
    max-width: 1000px;
    margin: 0 auto;
}

@media (max-width: 480px) {
    .form-selection-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}`;
css = css.replace(gridRegex, newGrid);

// Replace .form-select-card
const cardRegex = /\.form-select-card \{[\s\S]*?\.form-select-card:hover span \{\s*color: #2563eb;\s*\}/;
const appIconCSS = `.form-select-card {
    background: #ffffff;
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 24px;
    padding: 25px 15px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    outline: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    aspect-ratio: 1 / 1;
}

.form-select-card::before {
    display: none;
}

.form-select-card:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 15px 30px rgba(37, 99, 235, 0.12);
    border-color: rgba(37, 99, 235, 0.3);
}

.form-card-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(241, 245, 249, 0.8);
    backdrop-filter: blur(4px);
    color: #64748b;
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 8px;
    font-family: 'Sarabun', sans-serif;
    border: none;
    z-index: 1;
    transition: all 0.3s ease;
}

.form-select-card:hover .form-card-badge {
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
}

.form-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    color: white;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    margin-right: 0;
    box-shadow: 0 6px 12px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    z-index: 1;
    position: relative;
    flex-shrink: 0;
}

.form-select-card:hover .form-icon {
    transform: scale(1.1) rotate(5deg);
}

.form-select-card[data-form-type="MU.10-001"] .form-icon { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 8px 15px rgba(16,185,129,0.25); }
.form-select-card[data-form-type="MU.10-002"] .form-icon { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 8px 15px rgba(245,158,11,0.25); }
.form-select-card[data-form-type="MU.10-003"] .form-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 8px 15px rgba(59,130,246,0.25); }
.form-select-card[data-form-type="MU.10-004"] .form-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 8px 15px rgba(139,92,246,0.25); }
.form-select-card[data-form-type="MU.10-005"] .form-icon { background: linear-gradient(135deg, #ec4899, #db2777); box-shadow: 0 8px 15px rgba(236,72,153,0.25); }
.form-select-card[data-form-type="MU.10-006"] .form-icon { background: linear-gradient(135deg, #0ea5e9, #0284c7); box-shadow: 0 8px 15px rgba(14,165,233,0.25); }
.form-select-card[data-form-type="MU.10-007"] .form-icon { background: linear-gradient(135deg, #f43f5e, #e11d48); box-shadow: 0 8px 15px rgba(244,63,94,0.25); }

.form-select-card span {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 0;
    z-index: 1;
    position: relative;
    transition: color 0.3s ease;
    text-align: center;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.form-select-card:hover span {
    color: #2563eb;
}`;

css = css.replace(cardRegex, appIconCSS);
fs.writeFileSync('style_v3.css', css);
console.log('Applied Compact App Icon style');