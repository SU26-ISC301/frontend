const axios = require('axios');
axios.get('https://backend-production-0c3d.up.railway.app/v3/api-docs')
  .then(res => {
    console.log("Success! Paths count:", Object.keys(res.data.paths).length);
    // Write JSON to file to inspect it
    const fs = require('fs');
    fs.writeFileSync('swagger.json', JSON.stringify(res.data, null, 2));
    console.log("Saved to swagger.json");
  })
  .catch(err => {
    console.error("Failed:", err.message);
  });
