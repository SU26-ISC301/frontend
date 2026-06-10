const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const putProduct = swagger.paths['/api/products/{id}'].put;
console.log("Security:", JSON.stringify(putProduct.security, null, 2));
console.log("Responses:", JSON.stringify(putProduct.responses, null, 2));
