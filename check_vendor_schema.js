const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const schemas = swagger.components.schemas;
const vendorSchemas = Object.keys(schemas).filter(k => k.includes('Vendor') || k.includes('vendor'));
console.log('Vendor schemas found:', vendorSchemas);
vendorSchemas.forEach(s => {
  console.log(`Schema ${s} properties:`, Object.keys(schemas[s].properties || {}));
});
