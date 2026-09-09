const fs = require('fs');
let js = fs.readFileSync('app_v49_23.js', 'utf8');
if (js.includes('mousedown') && js.includes('mousemove')) {
    console.log('Custom drawing logic found');
} else {
    console.log('No custom drawing logic');
}
