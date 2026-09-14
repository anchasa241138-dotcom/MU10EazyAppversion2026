const fs = require('fs');
let js = fs.readFileSync('app_v53.js', 'utf8');

js = js.replace(
    '<div class="cert-header" style="margin-top: 5px;">\n                            <h3 style="font-size: 16px; margin: 0; text-align: center;">${reportTitle}</h3>\n                        </div>',
    '<div class="cert-header" style="margin-top: 5px; text-align: center; width: 100%;">\n                            <h3 style="font-size: 16px; margin: 0; text-align: center; width: 100%; display: block;">${reportTitle}</h3>\n                        </div>'
);

fs.writeFileSync('app_v53.js', js, 'utf8');
console.log("Forced center alignment");
