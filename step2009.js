const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const s = js.indexOf("container.innerHTML = `<style>.cert-pdf-border");
console.log(js.substring(s, s+500));