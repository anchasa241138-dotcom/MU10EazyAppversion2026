const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app_v83.js', 'utf8');

let match = html.match(/id="([^"]*modal[^"]*)"/ig);
console.log("Modals in HTML:", match);

const idx = html.indexOf('ผลการตรวจ');
if(idx !== -1) {
    console.log("Found in HTML around:", html.substring(idx - 100, idx + 400));
}

const jidx = js.indexOf('ผลการตรวจ');
if(jidx !== -1) {
    console.log("Found in JS around:", js.substring(jidx - 100, jidx + 400));
}