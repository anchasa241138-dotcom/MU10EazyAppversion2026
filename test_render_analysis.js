const fs = require('fs');

// Create mock DOM
class MockElement {
    constructor(id) {
        this.id = id;
        this.value = '';
        this.innerHTML = '';
        this.classList = {
            add: (c) => console.log('Added class:', c),
            remove: (c) => console.log('Removed class:', c)
        };
    }
    reset() {}
}

const elements = {};
global.document = {
    getElementById: (id) => {
        if (!elements[id]) elements[id] = new MockElement(id);
        return elements[id];
    }
};

const app = {
    samples: [{
        ref_id: 'TEMP-0012',
        lab_id: '0012',
        form_type: 'MU.10-006',
        sample_name_1: 'RO Vending 1',
        location_1: 'เทศบาล',
        amphoe_1: 'เมือง',
        company_1: 'บริษัท วอเตอร์',
        system_1: 'RO',
        ocpb_advice_1: 'on',
        status: 'accepted'
    }],
    currentUser: { fullname: 'Admin Mobile Unit 10' }
};

let js = fs.readFileSync('app_v84.js', 'utf8');

// Test running renderAnalysisDynamicSection
let start = js.indexOf('renderAnalysisDynamicSection(sample) {');
let end = js.indexOf('handleMu10004InterpretationChange(', start);
let fnCode = js.substring(start, end).replace('renderAnalysisDynamicSection(sample) {', 'function renderDynamic(sample) {');

eval(fnCode);
renderDynamic(app.samples[0]);
console.log('Successfully generated HTML for MU.10-006 in analysis modal!');
console.log('Length of container HTML:', elements['analysis-dynamic-section'].innerHTML.length);