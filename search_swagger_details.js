const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const putProduct = swagger.paths['/api/products/{id}'].put;
console.log("PUT /api/products/{id} details:");
console.log("Parameters:", JSON.stringify(putProduct.parameters, null, 2));
console.log("Request Body Content Type:", Object.keys(putProduct.requestBody.content));
const ref = putProduct.requestBody.content['application/json'].schema.$ref;
console.log("Schema Ref:", ref);

// Look up the schema definition
const schemaName = ref.split('/').pop();
const schema = swagger.components.schemas[schemaName];
console.log(`Schema [${schemaName}] Properties:`);
Object.keys(schema.properties).forEach(propName => {
  const p = schema.properties[propName];
  console.log(`- ${propName} (${p.type || p.$ref || 'object'})`);
});
