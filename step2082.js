const https = require('https');
const data = JSON.stringify({ fullname: 'Admin Mobile Unit 10' });
const options = {
  hostname: 'mu10-eazyapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  path: '/users/GImgeVkMQpXFQGeXYA2C4q5fbP42.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwMWQ0YTIwNzMwN2I0ZjM1NmFjZGI4NWNhNzE3ZWU3YmEwZGJmN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXUxMC1lYXp5YXBwIiwiYXVkIjoibXUxMC1lYXp5YXBwIiwiYXV0aF90aW1lIjoxNzkwNTgzMzMyLCJ1c2VyX2lkIjoiR0ltZ2VWa01RcFhGUUdlWFlBMkM0cTVmYlA0MiIsInN1YiI6IkdJbWdlVmtNUXBYRlFHZVhZQTJDNHE1ZmJQNDIiLCJpYXQiOjE3OTA1ODMzMzIsImV4cCI6MTc5MDU4NjkzMiwiZW1haWwiOiJhZG1pbkBtdTEwLmxvY2FsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFkbWluQG11MTAubG9jYWwiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.HEElex-el-Yhjep74AdP0QKGVZYxuTBIOlGVrAc52O4QWv150OqyH80kBDfMRpxjFQ0a9O9p2AaZ5d2yvEpTe4kfVFUlF8naFhN9yxGow4C2k_Pt0l381to_3pnhhC1ip4R1v1L8nqNZB2gp-xNoplm2N80W7VG8GuRwu8mVrY5AVH8OHkd3uAZma7RTYeuAmAkSP8Syi5ANBnQ20Ieqo-Ms56X6nlxHRxk24fArbEF3vbuo4ZoDWS_H5ypDLan8BqtjW2yHGQ5f79T4YSBii2dPAO1ccx2xdG6LqP9J5K7uvgzlIyyOIZBQT7ZYJiO11GCoYzSvzMg-3r7pv3fSBw',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};
const req = https.request(options, res => {
  res.on('data', d => process.stdout.write(d));
});
req.write(data);
req.end();