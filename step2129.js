const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const regex = /this\.currentUser = null;\s*sessionStorage\.removeItem\('sskmoph_session'\);\s*this\.updateAuthUI\(\);\s*this\.showLoginModal\(\);/g;

js = js.replace(regex, `this.currentUser = null;
                sessionStorage.removeItem('sskmoph_session');
                this.switchView('dashboard'); // Redirect to dashboard first
                this.updateAuthUI();
                this.showLoginModal();`);

fs.writeFileSync('app_v83.js', js);
console.log('Fixed logout redirection');