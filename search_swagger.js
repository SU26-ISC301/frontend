const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const paths = Object.keys(swagger.paths);
console.log("All API Paths in Backend:");
paths.forEach(p => {
  const methods = Object.keys(swagger.paths[p]);
  console.log(`- ${p} (${methods.join(', ').toUpperCase()})`);
});
