const https = require('https');
https.get('https://anchasa241138-dotcom.github.io/MU10EazyAppversion2026/', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const s = data.indexOf('<form id="registerForm"');
    const e = data.indexOf('</form>', s);
    console.log(data.substring(e - 250, e + 10));
  });
});