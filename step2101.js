const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const newVisible = getVisibleSamples() {
        if (!this.currentUser) return [];
        if (this.currentUser.role === 'admin' || this.currentUser.role === 'lab' || this.currentUser.role === 'certifier') {
            return this.samples;
        }
        
        const workplace = this.currentUser.workplace || '';
        const ssjMap = {
            'สำนักงานสาธารณสุขจังหวัดศรีสะเกษ': 'ศรีสะเกษ',
            'สำนักงานสาธารณสุขจังหวัดอุบลราชธานี': 'อุบลราชธานี',
            'สำนักงานสาธารณสุขจังหวัดยโสธร': 'ยโสธร',
            'สำนักงานสาธารณสุขจังหวัดอำนาจเจริญ': 'อำนาจเจริญ',
            'สำนักงานสาธารณสุขจังหวัดมุกดาหาร': 'มุกดาหาร'
        };
        
        if (ssjMap[workplace]) {
            return this.samples.filter(s => s.province === ssjMap[workplace]);
        }
        
        return this.samples.filter(s => s.created_by === this.currentUser.username);
    };

js = js.replace(/getVisibleSamples\(\) \{[\s\S]*?return this\.samples\.filter\(s => s\.created_by === this\.currentUser\.username\);\r?\n    \}/, newVisible);

// Revert dashboard back to getVisibleSamples
js = js.replace(/updateDashboardStats\(\) \{\r?\n\s*let visible = this\.samples; \/\/ Show global stats to everyone/, 
"updateDashboardStats() {\n        let visible = this.getVisibleSamples();");

fs.writeFileSync('app_v83.js', js);