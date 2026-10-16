const fs = require('fs');
const https = require('https');
const options = {
  hostname: 'mu10-eazyapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  path: '/samples.json',
  method: 'GET'
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
      const parsed = JSON.parse(data);
      if (parsed) {
          const samples = Object.values(parsed);
          let totalItems = 0;
          samples.forEach(s => {
              let idx = 1;
              let hasItems = false;
              while (s['sample_name_' + idx] !== undefined) {
                  hasItems = true;
                  totalItems++;
                  idx++;
              }
              if (!hasItems && s.sample_name) {
                  totalItems++;
              }
          });
          console.log('Total individual test items:', totalItems);
          console.log('Total forms:', samples.length);
      }
  });
});
req.end();