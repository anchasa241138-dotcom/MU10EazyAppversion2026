const https = require('https');
https.get('https://anchasa241138-dotcom.github.io/MU10EazyAppversion2026/app_v83.js', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        if(data.includes('auth.createUserWithEmailAndPassword')) {
            console.log('GitHub Pages HAS the new auth code.');
        } else {
            console.log('GitHub Pages DOES NOT have the new auth code yet.');
        }
        if(data.includes('asia-southeast1')) {
            console.log('GitHub Pages HAS the databaseURL fix.');
        }
    });
});