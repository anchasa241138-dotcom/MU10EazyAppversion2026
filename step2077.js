const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldConfig = 'appId: "1:180336075477:web:f0761e5da17f55f6d5f85c"';
const newConfig = 'appId: "1:180336075477:web:f0761e5da17f55f6d5f85c",\n            databaseURL: "https://mu10-eazyapp-default-rtdb.asia-southeast1.firebasedatabase.app"';

if(html.includes(oldConfig) && !html.includes('databaseURL')) {
    html = html.replace(oldConfig, newConfig);
    // Bump version
    html = html.replace(/app_v83\.js\?v=\d+/, `app_v83.js?v=${Date.now()}`);
    fs.writeFileSync('index.html', html);
    console.log("Added databaseURL to firebaseConfig");
}