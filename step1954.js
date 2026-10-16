const fs = require('fs');
const buf = fs.readFileSync('cert_background.png');
const b64 = buf.toString('base64');
console.log("cert_background.png base64 length:", b64.length);
console.log("Starts with:", b64.substring(0, 50));