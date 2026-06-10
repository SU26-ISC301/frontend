const axios = require('axios');
axios.get('https://backend-production-0c3d.up.railway.app/api/products')
  .then(res => {
    console.log("Success:", JSON.stringify(res.data, null, 2).substring(0, 1000));
  })
  .catch(err => {
    console.error("Error:", err.message);
  });
