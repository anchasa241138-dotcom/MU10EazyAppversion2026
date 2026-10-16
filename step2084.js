const https = require('https');
const options = {
  hostname: 'mu10-eazyapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  path: '/users.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwMWQ0YTIwNzMwN2I0ZjM1NmFjZGI4NWNhNzE3ZWU3YmEwZGJmN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXUxMC1lYXp5YXBwIiwiYXVkIjoibXUxMC1lYXp5YXBwIiwiYXV0aF90aW1lIjoxNzkwNTg0Mjc3LCJ1c2VyX2lkIjoiR0ltZ2VWa01RcFhGUUdlWFlBMkM0cTVmYlA0MiIsInN1YiI6IkdJbWdlVmtNUXBYRlFHZVhZQTJDNHE1ZmJQNDIiLCJpYXQiOjE3OTA1ODQyNzcsImV4cCI6MTc5MDU4Nzg3NywiZW1haWwiOiJhZG1pbkBtdTEwLmxvY2FsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFkbWluQG11MTAubG9jYWwiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.f2hwxjKnhu5srIoBt4P5NO7hnbWBGl5N-2TPjRFDP24MIW1m1nkOxhz4QRyZ239nuHH6ZfYXTYnab9UaKqvVxLsjXwUnJ-FsQihNuCOlHN_4yMuuX_rGkr7qZOOblj2ZkuebTa_8nPx0TCgKziqzWbgJtGsllevqVMJBOtafp4sAXVrsJyQ___Q63ZHbnox_2oOKVG9dyn9pjnXI6pQZGdhBjFzqRZVo42y1XtOaCB9jvDaz1-80af6Lb5fdJvhoxgf-rPwxEzv8dZbbVCN8s3ekRUGXiMVCt4FJUWhsdaGgVhOff0_La8bdHg5KIHmbQdZbPWr1twsm8zBX19_5JQ',
  method: 'GET'
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data));
});
req.end();