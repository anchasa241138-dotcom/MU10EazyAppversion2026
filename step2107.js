const https = require('https');
const options = {
  hostname: 'mu10-eazyapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  path: '/users.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwMWQ0YTIwNzMwN2I0ZjM1NmFjZGI4NWNhNzE3ZWU3YmEwZGJmN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXUxMC1lYXp5YXBwIiwiYXVkIjoibXUxMC1lYXp5YXBwIiwiYXV0aF90aW1lIjoxNzkwNTg3NTQ1LCJ1c2VyX2lkIjoiR0ltZ2VWa01RcFhGUUdlWFlBMkM0cTVmYlA0MiIsInN1YiI6IkdJbWdlVmtNUXBYRlFHZVhZQTJDNHE1ZmJQNDIiLCJpYXQiOjE3OTA1ODc1NDUsImV4cCI6MTc5MDU5MTE0NSwiZW1haWwiOiJhZG1pbkBtdTEwLmxvY2FsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFkbWluQG11MTAubG9jYWwiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.SZYlTF3tNFsJ-Z5xD2mwnq8TktrbSlozrfxsUMtIEO-xVK9slLwwIYHXTW_lUxHEH3HWH4aG_GLKJTKWe3Z1oLwQjDojFEGyPwiAuqYbSmvEZe9mKU4mPVh8KfHpwVraMsE4KZH9e4qEFgDX_mEOoIAvpZlyfOrBFSSDt5GXnpGfsv7RwfK0YOZSPt64deL66iwF7bDmIUJqHSH-32CVipUKlrSk_hLRB97NsuM3E9hrWg2gHDwl-8ezh5Z3IA0apI6QlsRKm7nsPYfTw7D7zDP4fdAjB0Q9U0_QqQRiAjGGskPgxzYf9UUSD17cP6vGFxO_BcftOHimmvgf2DcGGA',
  method: 'GET'
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data));
});
req.end();