const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// Simulate DOM
class Element {
    constructor(tag) {
        this.tagName = tag;
        this.children = [];
        this.innerHTML = '';
        this.style = {};
        this.value = '';
    }
    appendChild(child) { this.children.push(child); }
    closest() { return this; }
}

const elements = {
    'field-form-type': { value: 'MU.10-006' },
    'globalSampleEntries': new Element('div'),
    'sampleQuantity': { value: 1 }
};

global.document = {
    getElementById: (id) => elements[id] || new Element('div'),
    createElement: (tag) => new Element(tag)
};

// Test logic from addGlobalSampleEntry
const formType = document.getElementById('field-form-type').value;
console.log('Detected formType:', formType);

let testDiv = new Element('div');
// Check which branch it takes
if (formType === 'MU.10-003') {
    console.log('Branch: MU.10-003');
} else if (formType === 'MU.10-004') {
    console.log('Branch: MU.10-004');
} else if (formType === 'MU.10-005') {
    console.log('Branch: MU.10-005');
} else if (formType === 'MU.10-008') {
    console.log('Branch: MU.10-008');
} else if (formType === 'MU.10-002') {
    console.log('Branch: MU.10-002');
} else if (formType === 'MU.10-006') {
    console.log('Branch: MU.10-006');
} else {
    console.log('Branch: else (default)');
}