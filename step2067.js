const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const firebaseScript = `
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-database-compat.js"></script>
    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyBEHz4pSxFZO7qYm9Dpa-SlAuluuuQxaAU",
            authDomain: "mu10-eazyapp.firebaseapp.com",
            projectId: "mu10-eazyapp",
            storageBucket: "mu10-eazyapp.firebasestorage.app",
            messagingSenderId: "180336075477",
            appId: "1:180336075477:web:f0761e5da17f55f6d5f85c"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
    </script>
`;

html = html.replace('<script src="app_v83.js', firebaseScript + '\n    <script src="app_v83.js');
// Bump versions
html = html.replace(/app_v83\.js\?v=\d+/, `app_v83.js?v=${Date.now()}`);
html = html.replace(/charts-dash\.js\?v=\d+/, `charts-dash.js?v=${Date.now()}`);

fs.writeFileSync('index.html', html);
console.log("Added Firebase to index.html");