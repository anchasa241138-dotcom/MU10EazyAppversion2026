const https = require('https');
const options = {
  hostname: 'mu10-eazyapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  path: '/users.json',
  method: 'GET'
};
const req = https.request(options, res => {
  res.on('data', d => process.stdout.write(d));
});
req.end();