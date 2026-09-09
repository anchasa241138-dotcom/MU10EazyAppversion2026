const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    /<div class="modal-body" style="padding: 20px; max-height: 65vh; overflow: hidden;">/g,
    '<div class="modal-body" style="padding: 20px; max-height: 65vh; overflow-y: auto;">'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed overflow bug');
