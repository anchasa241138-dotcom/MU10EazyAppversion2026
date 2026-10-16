const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const oldStyle = "wrap.style.cssText = 'position: absolute; top: 0; left: 0; width: 794px; height: 1122px; background: white; z-index: 99999; margin: 0; padding: 0;';";
const newStyle = "wrap.style.cssText = 'position: absolute; top: -9999px; left: -9999px; width: 794px; height: 1122px; background: white; z-index: -1; margin: 0; padding: 0;';";

js = js.replace(oldStyle, newStyle);
fs.writeFileSync('app_v83.js', js);
console.log("Moved html2canvas wrap off-screen!");