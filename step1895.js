const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const match = js.match(/openCertifyModal\s*\([^)]*\)\s*\{/);
if (match) {
    console.log(js.substring(match.index, match.index + 800));
}