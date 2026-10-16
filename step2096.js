const fs = require('fs');
const js = fs.readFileSync('app_v83.js', 'utf8');
console.log('Includes createUserWithEmailAndPassword?', js.includes('createUserWithEmailAndPassword'));