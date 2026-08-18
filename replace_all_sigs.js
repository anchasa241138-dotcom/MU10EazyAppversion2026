const fs = require('fs');

const imgAnchasa = fs.readFileSync('C:/Users/HUAWEI/.gemini/antigravity/brain/c9954741-54a5-4085-929f-f5fca1c5d15a/.user_uploaded/media_1787028508921.png');
const base64Anchasa = 'data:image/png;base64,' + imgAnchasa.toString('base64');

const imgSurachai = fs.readFileSync('C:/Users/HUAWEI/.gemini/antigravity/brain/c9954741-54a5-4085-929f-f5fca1c5d15a/.user_uploaded/media_1787028514447.png');
const base64Surachai = 'data:image/png;base64,' + imgSurachai.toString('base64');

const imgMallika = fs.readFileSync('C:/Users/HUAWEI/.gemini/antigravity/brain/c9954741-54a5-4085-929f-f5fca1c5d15a/.user_uploaded/media_1787028517950.png');
const base64Mallika = 'data:image/png;base64,' + imgMallika.toString('base64');

let content = fs.readFileSync('app_v49_23.js', 'utf8');

const bk = String.fromCharCode(96); // backtick

// Replace Anchasa
const regexAnchasa = /('anchasa':\s*\{[^}]*sig:\s*)([^]+|'[^']+')(\s*\})/;
content = content.replace(regexAnchasa, (match, p1, p2, p3) => {
    return p1 + bk + base64Anchasa + bk + p3;
});

// Replace Surachai
const regexSurachai = /('surachai':\s*\{[^}]*sig:\s*)([^]+|'[^']+')(\s*\})/;
content = content.replace(regexSurachai, (match, p1, p2, p3) => {
    return p1 + bk + base64Surachai + bk + p3;
});

// Replace Mallika
const regexMallika = /('mallika':\s*\{[^}]*sig:\s*)([^]+|'[^']+')(\s*\})/;
content = content.replace(regexMallika, (match, p1, p2, p3) => {
    return p1 + bk + base64Mallika + bk + p3;
});

content = content.replace(/app_v49_23\.js\?v=\d+/g, 'app_v49_23.js?v=47');
fs.writeFileSync('app_v49_23.js', content, 'utf8');
console.log('Replaced 3 signatures in JS');
