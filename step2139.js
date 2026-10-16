const fs = require('fs');
let css = fs.readFileSync('style_v3.css', 'utf8');

// 1. Add form-selection-grid class
const gridClass = `
.form-selection-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    padding: 20px 10px;
    max-width: 1100px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .form-selection-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Inject before .form-select-card
css = css.replace(/\.form-select-card \{/, gridClass + "\n.form-select-card {");

// 2. Clean up .form-select-card properties (remove flex, max-width)
css = css.replace(/width: 100%;\s*flex: 1 1 340px;\s*max-width: 450px;/, "width: 100%;");

fs.writeFileSync('style_v3.css', css);
console.log('Updated CSS');