const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    /<script src="https:\/\/cdn.jsdelivr.net\/npm\/sweetalert2@11"><\/script>/,
    `<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>\n    <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.1.7/dist/signature_pad.umd.min.js"></script>`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Added SignaturePad script');
