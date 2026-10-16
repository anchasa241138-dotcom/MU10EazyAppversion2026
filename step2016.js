const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const oldHtml1 = `<style>.pdf-document * { font-family: 'TH SarabunPSK', 'SarabunPDF', 'Sarabun', sans-serif !important; letter-spacing: normal !important; }</style> 
              <style>.cert-pdf-border { background-image: url('\${CERT_BG_BASE64}') !important; background-size: cover; }</style>
              <div class="pdf-document cert-pdf-border" style="width: 780px !important; height: 1103px !important; max-height: 1103px !important; display: block; position: relative; margin: 0 auto; padding: 155px 45px 100px 45px; box-sizing: border-box; background-color: white; color: black; background-size: 100% 100% !important; background-repeat: no-repeat !important;">`;

const newHtml1 = `<div class="pdf-document cert-pdf-border" style="width: 780px !important; height: 1103px !important; max-height: 1103px !important; display: block; position: relative; margin: 0 auto; padding: 155px 45px 100px 45px; box-sizing: border-box; background-color: white; color: black; background-size: 100% 100% !important; background-repeat: no-repeat !important;">
                  <style>.pdf-document * { font-family: 'TH SarabunPSK', 'SarabunPDF', 'Sarabun', sans-serif !important; letter-spacing: normal !important; }</style> 
                  <style>.cert-pdf-border { background-image: url('\${CERT_BG_BASE64}') !important; background-size: cover; }</style>`;

js = js.replace(oldHtml1, newHtml1);
js = js.replace(oldHtml1, newHtml1);

fs.writeFileSync('app_v83.js', js);
console.log("Moved styles inside div!");