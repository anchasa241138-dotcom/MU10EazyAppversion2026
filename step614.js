const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<option value="nonglak">นางสาวนงลักษณ์ ชมภู<\/option>\s*<option value="nattakarn">นางสาวณัฐกานต์ วงษ์ประสงค์<\/option>\s*<option value="sujittra">นางสาวสุจิตรา แก้วมณี<\/option>/g, '');

fs.writeFileSync('index.html', html, 'utf8');
