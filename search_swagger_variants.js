const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const productResponseSchema = swagger.components.schemas.ProductResponse;
const variantRef = productResponseSchema.properties.variants.items.$ref;
const variantSchema = swagger.components.schemas[variantRef.split('/').pop()];
console.log("VariantResponse properties:", JSON.stringify(variantSchema, null, 2));
