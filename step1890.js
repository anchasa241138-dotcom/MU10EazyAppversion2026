const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// I will just execute it in node with a dummy DOM!
const dom = `
const document = {
    fonts: { load: () => {} },
    getElementById: () => ({ value: '', innerHTML: '', style: {}, src: '', classList: { add:()=>{}, remove:()=>{} } }),
    createElement: () => ({ innerHTML: '', style: {}, appendChild: () => {}, querySelector: () => ({ src: '' }) }),
    head: { appendChild: () => {} },
    querySelector: () => null
};
const window = { Swal: { fire: () => Promise.resolve() }, location: { search: '' }, addEventListener: ()=>{} };
const localStorage = { getItem: () => null, setItem: () => {} };
const sessionStorage = { getItem: () => null, setItem: () => {} };
const navigator = { userAgent: '' };
const html2pdf = () => ({ set: () => ({ from: () => ({ toContainer: () => ({ toCanvas: () => ({ toImg: () => ({ toPdf: () => ({ get: (type) => ({ then: (cb) => { cb({ output: ()=>'pdf' }); return Promise.resolve(); } }) }) }) }) }) }) }) });
const DOMPurify = { sanitize: (s) => s };
const Chart = class {};
`;

let executable = dom + js + `
try {
    app.generatePDF({ form_type: 'MU.10-005', ref_id: '123' }, true);
    console.log("SUCCESS!");
} catch (e) {
    console.log("ERROR IN generatePDF:", e.message);
    console.log(e.stack);
}
`;

fs.writeFileSync('test_pdf.js', executable);