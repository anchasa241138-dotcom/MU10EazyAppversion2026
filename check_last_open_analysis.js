const fs = require('fs');
let js = fs.readFileSync('app_v84.js', 'utf8');

let pos = js.lastIndexOf('openAnalysisModal');
console.log('Last pos of openAnalysisModal:', pos);
console.log(js.substring(pos, pos + 2500));