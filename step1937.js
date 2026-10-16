const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf('.cert-pdf-border { background-image: url(');
if(s > -1) {
    console.log("Found .cert-pdf-border in file at index " + s);
    // find what function it is in
    const before = js.substring(0, s);
    const lastFunc = before.lastIndexOf('function');
    const lastMethod = before.lastIndexOf(' {');
    // let's just list the 5 lines before it
    console.log(js.substring(s-300, s));
}