const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// Update initData to attach Firebase listeners
let initDataReplacement = `
    initData() {
        if (typeof db !== 'undefined') {
            // Firebase real-time listeners
            db.ref('samples').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    this.samples = data;
                } else {
                    this.resetDefaultSamples();
                    db.ref('samples').set(this.samples);
                }
                if (window.updateDashboardCharts) updateDashboardCharts(this.samples);
                this.renderSamplesList();
            });

            db.ref('users').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    this.users = data;
                } else {
                    // Default users
                    this.users = [
                        { username: 'admin', password: 'password', role: 'admin', fullname: 'Admin Mobile Unit 10', status: 'approved' },
                        { username: 'lab', password: 'password', role: 'lab', fullname: 'นสพ.วิทยา รักดี', status: 'approved' },
                        { username: 'user', password: 'password', role: 'collector', fullname: 'นายสมคิด สุขใจ', status: 'approved' }
                    ];
                    db.ref('users').set(this.users);
                }
                this.updateAuthUI();
                if (document.getElementById('manage-users-view').style.display === 'block') {
                    this.renderManageUsers();
                }
            });
        }
        
        // Restore session
        try {
            const session = sessionStorage.getItem('sskmoph_session');
            if (session) {
                this.currentUser = JSON.parse(session);
            }
        } catch (e) {
            this.currentUser = null;
        }
    },
`;

js = js.replace(/initData\(\) \{[\s\S]*?resetDefaultSamples\(\) \{/, initDataReplacement + '\n    resetDefaultSamples() {');

// Replace localStorage.setItem('sskmoph_samples'...) with db.ref('samples').set
js = js.replace(/saveSamples\(\)\s*\{\s*localStorage\.setItem\('sskmoph_samples', JSON\.stringify\(this\.samples\)\);[\s\S]*?\}/g, 
`saveSamples() {
        if (typeof db !== 'undefined') {
            db.ref('samples').set(this.samples);
        } else {
            localStorage.setItem('sskmoph_samples', JSON.stringify(this.samples));
        }
    }`);

// Replace all localStorage.setItem('sskmoph_users'...) with db.ref('users').set
js = js.replace(/localStorage\.setItem\('sskmoph_users', JSON\.stringify\(this\.users\)\);/g, `if(typeof db !== 'undefined') { db.ref('users').set(this.users); }`);

fs.writeFileSync('app_v83.js', js);
console.log("Updated app_v83.js for Firebase");