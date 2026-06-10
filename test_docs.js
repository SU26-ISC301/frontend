const axios = require('axios');
const urls = [
  'https://backend-production-0c3d.up.railway.app/swagger-ui.html',
  'https://backend-production-0c3d.up.railway.app/swagger-ui/index.html',
  'https://backend-production-0c3d.up.railway.app/api-docs',
  'https://backend-production-0c3d.up.railway.app/v3/api-docs',
  'https://backend-production-0c3d.up.railway.app/v2/api-docs',
];

async function check() {
  for (const url of urls) {
    try {
      const res = await axios.get(url);
      console.log(`Found: ${url} (Status: ${res.status})`);
      if (typeof res.data === 'object') {
        console.log("JSON keys:", Object.keys(res.data));
      } else {
        console.log("HTML length:", res.data.length);
      }
      return;
    } catch (err) {
      console.log(`Failed: ${url} (${err.message})`);
    }
  }
}
check();
