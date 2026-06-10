const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const apiResponse = swagger.components.schemas.ApiResponseProductResponse;
console.log("ApiResponseProductResponse:", JSON.stringify(apiResponse, null, 2));

const productResponseRef = apiResponse.properties.data.$ref;
const productResponseSchema = swagger.components.schemas[productResponseRef.split('/').pop()];
console.log("ProductResponse properties:");
Object.keys(productResponseSchema.properties).forEach(k => {
  console.log(`- ${k}`);
});

const attrRef = productResponseSchema.properties.attributes.items.$ref;
const attrSchema = swagger.components.schemas[attrRef.split('/').pop()];
console.log("AttributeResponse properties:", JSON.stringify(attrSchema, null, 2));
