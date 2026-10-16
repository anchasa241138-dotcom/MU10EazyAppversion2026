const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

// Replace orientation logic to consider MU.10-008 as landscape (so we leave it out of the portrait check)
// Portrait is MU.10-004 and MU.10-005. So MU.10-008 will be landscape by default.
// Let's make sure MU.10-008 width is wide enough
// `windowWidth: 1200` is the default for landscape, which is fine.

console.log('No change needed for MU.10-008 orientation, default is landscape which is correct.');