const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("pages = Array.from(dynamicContent.children);");
js = js.substring(0, s) + "pages = Array.from(dynamicContent.children).filter(el => el.tagName !== 'STYLE' && el.tagName !== 'SCRIPT');" + js.substring(s + "pages = Array.from(dynamicContent.children);".length);

const s2 = js.indexOf("pages = Array.from(container.children);");
js = js.substring(0, s2) + "pages = Array.from(container.children).filter(el => el.tagName !== 'STYLE' && el.tagName !== 'SCRIPT');" + js.substring(s2 + "pages = Array.from(container.children);".length);

fs.writeFileSync('app_v83.js', js);
console.log("Fixed blank pages bug!");