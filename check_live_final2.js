const https = require('https');

https.get('https://anchasa241138-dotcom.github.io/MU10EazyAppversion2026/index.html', (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
        let m = data.match(/app_v84\.js\?v=(\d+)/);
        if (m) {
            console.log('Live index.html references app_v84.js with v =', m[1]);
        }
    });
});