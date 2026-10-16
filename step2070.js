const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('firebase-auth-compat')) {
    html = html.replace(
        '<script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-database-compat.js"></script>',
        '<script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-database-compat.js"></script>\n    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-auth-compat.js"></script>'
    );
    html = html.replace(
        'const db = firebase.database();',
        'const db = firebase.database();\n        const auth = firebase.auth();'
    );
    fs.writeFileSync('index.html', html);
    console.log("Added Firebase Auth script to index.html");
} else {
    console.log("Firebase Auth already added.");
}