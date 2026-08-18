const fs = require('fs');
const path = require('path');

function getBase64(file) {
    if (!fs.existsSync(file)) return null;
    const data = fs.readFileSync(file);
    const ext = path.extname(file).replace('.', '');
    return `data:image/${ext};base64,` + data.toString('base64');
}

const anchasa = getBase64('sig_anchasa.png');
const surachai = getBase64('sig_surachai.png');
const thitiporn = getBase64('sig_thitiporn.png');
const mallika = getBase64('sig_mallika.png');
const bg = getBase64('cert_background.png');

let code = fs.readFileSync('app_v49_23.js', 'utf8');

// Replace PERSON_DATA sigs
code = code.replace(/sig: 'sig_anchasa\.png'/g, `sig: '${anchasa}'`);
code = code.replace(/sig: 'sig_surachai\.png'/g, `sig: '${surachai}'`);
code = code.replace(/sig: 'sig_thitiporn\.png'/g, `sig: '${thitiporn}'`);
code = code.replace(/sig: 'sig_mallika\.png'/g, `sig: '${mallika}'`);

// Replace background image in CSS if exists
// Wait, the background is injected via CSS.
code = code.replace(
    /container\.innerHTML = `/,
    `container.innerHTML = \`<style>.cert-pdf-border { background-image: url('${bg}') !important; background-size: cover; }</style>`
);

code = code.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=38');
fs.writeFileSync('app_v49_23.js', code, 'utf8');

let indexCode = fs.readFileSync('index.html', 'utf8');
indexCode = indexCode.replace(/app_v49_23\.js\?v=\d+/, 'app_v49_23.js?v=38');
fs.writeFileSync('index.html', indexCode, 'utf8');

console.log("Images base64 encoded and injected");
