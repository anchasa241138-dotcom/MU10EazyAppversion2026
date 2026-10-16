const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const replacementCode = `this.currentUser = null;
                sessionStorage.removeItem('sskmoph_session');
                document.body.classList.add('require-login-mode'); // Make sure background is locked
                const closeBtn = document.querySelector('#authModal .close-modal-btn');
                if (closeBtn) closeBtn.style.display = 'none'; // Prevent closing
                this.switchView('dashboard'); // Redirect to dashboard first
                this.updateAuthUI();
                this.showLoginModal();`;

js = js.replace(/this\.currentUser = null;\s*sessionStorage\.removeItem\('sskmoph_session'\);\s*this\.switchView\('dashboard'\); \/\/ Redirect to dashboard first\s*this\.updateAuthUI\(\);\s*this\.showLoginModal\(\);/g, replacementCode);

fs.writeFileSync('app_v83.js', js);
console.log('Fixed logout login-lock');