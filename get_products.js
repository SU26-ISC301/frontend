const axios = require('axios');
axios.get('https://backend-production-0c3d.up.railway.app/api/products/vendor/12')
  .then(res => {
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(err => {
    console.error(err.message);
  });
