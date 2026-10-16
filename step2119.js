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
          console.log('Total samples in DB:', samples.length);
          const formTypes = {};
          samples.forEach(s => {
              formTypes[s.form_type] = (formTypes[s.form_type] || 0) + 1;
          });
          console.log('Form Types:', formTypes);
      }
  });
});
req.end();