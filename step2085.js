const https = require('https');
const options = {
  hostname: 'mu10-eazyapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  path: '/users.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwMWQ0YTIwNzMwN2I0ZjM1NmFjZGI4NWNhNzE3ZWU3YmEwZGJmN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXUxMC1lYXp5YXBwIiwiYXVkIjoibXUxMC1lYXp5YXBwIiwiYXV0aF90aW1lIjoxNzkwNTg0NzAwLCJ1c2VyX2lkIjoiR0ltZ2VWa01RcFhGUUdlWFlBMkM0cTVmYlA0MiIsInN1YiI6IkdJbWdlVmtNUXBYRlFHZVhZQTJDNHE1ZmJQNDIiLCJpYXQiOjE3OTA1ODQ3MDAsImV4cCI6MTc5MDU4ODMwMCwiZW1haWwiOiJhZG1pbkBtdTEwLmxvY2FsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFkbWluQG11MTAubG9jYWwiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.XvMEm0fl-5STcF0GT_VTcMfy_u8TET63nsla6m22QhqBuWTBL9P7A7TAa_cR7LfkPa8dVnCy_bdkju_yXbm4xaOUODoZ0vTJGSa_kfjSFchkNK6iPI67lWGEPk7sBb-lMxAADz01UsdzPk97T1e_J7-yRIpPf5q96sRmyFhMOtyYw8k8FfwwDuIaGflHeyDzhTgwXv5AbGnYFD5Ce3dcOqC3o2P_CjSSX9e8ekV0b0Fj4o_RL0icH3xPeWjFvwQsXKK47LfpyLO7PrMIs0zdHUjwSaE7YryF_sXrMUn2tgnRPD0qdo8J-brPYBRHJqWM657gUavqk3xxcCuKD5Vpuw',
  method: 'GET'
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data));
});
req.end();