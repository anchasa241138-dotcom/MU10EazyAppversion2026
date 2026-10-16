const https = require('https');

https.get('https://anchasa241138-dotcom.github.io/MU10EazyAppversion2026/app_v83.js?v=1791257586422', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Length:', data.length);
        console.log('Has MU.10-006 entry:', data.includes("รายการน้ำจากตู้หยอดเหรียญ"));
        console.log('Has MU.10-006 in addGlobal:', data.includes("else if (formType === 'MU.10-006')"));
    });
});