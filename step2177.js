const fs = require('fs');
let js = fs.readFileSync('app_v83.js', 'utf8');

const regex = /s\.status === 'pending' \|\| s\.status === 'verified' \|\| s\.status === 'lab_received' \|\| s\.status === 'analyzed'/g;
js = js.replace(regex, "s.status === 'pending' || s.status === 'registered' || s.status === 'accepted' || s.status === 'analyzed'");

fs.writeFileSync('app_v83.js', js);
console.log('Fixed migration script to include accepted and registered');