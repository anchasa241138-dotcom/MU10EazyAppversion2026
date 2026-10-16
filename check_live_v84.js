const https = require('https');

https.get('https://anchasa241138-dotcom.github.io/MU10EazyAppversion2026/app_v84.js?v=1791257971590', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Live app_v84.js status:');
        console.log('Length:', data.length);
        console.log('Contains MU.10-006 form fields:', data.includes("รายการน้ำจากตู้หยอดเหรียญ"));
        console.log('Contains MU.10-006 title:', data.includes("แบบบันทึกเก็บตัวอย่างน้ำบริโภคจากตู้น้ำดื่มหยอดเหรียญ"));
        console.log('Contains MU.10-006 in addGlobal:', data.includes("else if (formType === 'MU.10-006')"));
    });
});